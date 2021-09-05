import React, { useState } from "react";
import "./App.css";
import { allItems } from "./items.js";
import { locations } from "./locations.js";

function App() {
  const startingState = {
    reputation: 10,
    gold: 0,
    timeInCave: 0,
    swordCost: 50,
    ownSword: false,
    fire: true,
    naked: true,
    squirrelDead: false,
    horseDead: false,
    horseTethered: false,
    horseMounted: false,
    poisoned: false,
    poopy: false,
    handkerchiefDamp: false,
    masked: false,
    babyCough: false,
    savedBaby: false,
    receivedBabyReward: false,
    playedForAdolescent: false,
    promisedTreasure: false,
    cursed: false,
    firstCourtyardEntry: true,
    dragonPoisoned: false,
    dragonAsleep: false,
    dragonDead: false,
    treasureAmount: 100,
    singeCount: 0,
  };

  function buildStartingLocations() {
    const startingItemLocations = {
      inventory: new Set([
        "lute",
        "clothes",
        "apple",
        "handkerchief",
        "baby",
        "sword",
        "horse",
        "berries",
        "score",
      ]),
      outOfPlay: new Set([]),
    };

    Object.keys(locations).forEach(
      (location) => (startingItemLocations[location] = new Set())
    );

    for (const [item, itemInfo] of Object.entries(allItems)) {
      startingItemLocations[itemInfo.spawnLocation].add(item);
    }

    return startingItemLocations;
  }

  const startingItemLocations = buildStartingLocations();

  const [itemLocations, setItemLocations] = useState(startingItemLocations);

  const [gameState, setGameState] = useState(startingState);
  const [playerLocation, setPlayerLocation] = useState("clearing");
  const [consequenceText, setConsequenceText] = useState("");
  const [currentDisplay, setCurrentDisplay] = useState("location"); // location | inventory | consequence

  // todo add tests that locations and items have required values

  // todo write end game and scoring

  function moveItem({ item, oldLocation, newLocation }) {
    console.log(`'moving' ${item} from ${oldLocation} to ${newLocation}`);
    itemLocations[oldLocation].delete(item);
    itemLocations[newLocation].add(item);
    setItemLocations(itemLocations);
  }

  function handleMovePlayer(newLocation) {
    let gameStateChanges = {};

    const oldLocation = playerLocation;

    const customExitStateEffect =
      locations[oldLocation].onExitGameStateEffect &&
      locations[oldLocation].onExitGameStateEffect({
        gameState: gameState,
        playerLocation: playerLocation,
        itemLocations: itemLocations,
      });
    gameStateChanges = { ...gameStateChanges, ...customExitStateEffect };

    const customEnterStateEffect =
      locations[oldLocation].onEnterGameStateEffect &&
      locations[oldLocation].onEnterGameStateEffect({
        gameState: gameState,
        playerLocation: playerLocation,
        itemLocations: itemLocations,
      });
    gameStateChanges = { ...gameStateChanges, ...customEnterStateEffect };

    if (Object.keys(gameStateChanges).length) {
      setGameState({
        ...gameState,
        ...gameStateChanges,
      });
    }

    const customEnterItemLocationEffect =
      locations[newLocation].onEnterItemLocationEffect &&
      locations[newLocation].onEnterItemLocationEffect({
        gameState: gameState,
        playerLocation: playerLocation,
        itemLocations: itemLocations,
      });

    if (customEnterItemLocationEffect) {
      moveItem(customEnterItemLocationEffect);
    }

    const customExitItemLocationEffect =
      locations[newLocation].onExitItemLocationEffect &&
      locations[newLocation].onExitItemLocationEffect({
        gameState: gameState,
        playerLocation: playerLocation,
        itemLocations: itemLocations,
      });

    if (customExitItemLocationEffect) {
      moveItem(customExitItemLocationEffect);
    }

    setPlayerLocation(newLocation);
  }

  function handleTake(item) {
    // Get the "take"" description for the item -- this will be the consequence text
    const customDescription =
      allItems[item].getCustomTakeDescription &&
      allItems[item].getCustomTakeDescription({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    const description =
      customDescription ||
      `You now have ${
        ["a", "e", "i", "o", "u"].includes(
          allItems[item]
            .getDescription({
              playerLocation: playerLocation,
              gameState: gameState,
              itemLocations: itemLocations,
            })[0]
            .toLowerCase()
        )
          ? "an"
          : "a"
      } ${allItems[item].getDescription({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      })}.`;

    // Get the "take" end location for the item -- will usually be "inventory"
    const customItemLocation =
      allItems[item].getCustomTakeLocation &&
      allItems[item].getCustomTakeLocation({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    const endItemLocation = customItemLocation || "inventory";

    // Get any effect on the game state
    const customGameEffect =
      allItems[item].getCustomTakeGameEffect &&
      allItems[item].getCustomTakeGameEffect({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    if (customGameEffect) {
      setGameState({ ...gameState, ...customGameEffect });
    }

    // Set the item location to the take end location
    moveItem({
      item: item,
      oldLocation: playerLocation,
      newLocation: endItemLocation,
    });

    // set the consequence text to the take description text
    setConsequenceText(description);

    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function handleUse(item) {
    // Get the "use"" description for the item -- this will be the consequence text
    const customDescription =
      allItems[item].getCustomUseDescription &&
      allItems[item].getCustomUseDescription({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    const description =
      customDescription ||
      `You use the ${allItems[item].displayName.toLowerCase()}.`;

    // Get any effect on the game state
    const customGameEffect =
      allItems[item].getCustomUseGameEffect &&
      allItems[item].getCustomUseGameEffect({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    // Update game state with any custom effect
    if (customGameEffect) {
      setGameState({ ...gameState, ...customGameEffect });
    }

    // set the consequence text to the use description text
    setConsequenceText(description);

    // show consequence
    setCurrentDisplay("consequence");
  }

  function handleDrop(item) {
    // Get the "drop"" description for the item -- this will be the consequence text
    const customDescription =
      allItems[item].getCustomDropDescription &&
      allItems[item].getCustomDropDescription({
        dropPreposition: locations[playerLocation].dropPreposition,
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    const description =
      customDescription ||
      `You drop the ${item} ${locations[playerLocation].dropPreposition} the ${playerLocation}.`;

    // Get the "drop" end location for the item -- will usually be the current player location
    const customItemLocation =
      allItems[item].getCustomDropLocation &&
      allItems[item].getCustomDropLocation({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    const endItemLocation = customItemLocation || playerLocation;

    console.log(`drop at ${endItemLocation}`);

    // Get any effect on the game state
    const customGameEffect =
      allItems[item].getCustomDropGameEffect &&
      allItems[item].getCustomDropGameEffect({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    if (customGameEffect) {
      setGameState({ ...gameState, ...customGameEffect });
    }

    // Set the item location from the inventory to the new location
    moveItem({
      item: item,
      oldLocation: "inventory",
      newLocation: endItemLocation,
    });

    // set the consequence text to the drop description text
    setConsequenceText(description);

    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function handlePay() {
    // todo not checking yet if you have enough gold to buy
    if (
      (locations[playerLocation].payDescription &&
        locations[playerLocation].payDescription({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        })) ||
      (locations[playerLocation].payGameStateEffect &&
        locations[playerLocation].payGameStateEffect({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        })) ||
      (locations[playerLocation].payItemLocationEffect &&
        locations[playerLocation].payItemLocationEffect({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        }))
    ) {
      handleAcceptedPay();
    } else {
      handleUnwantedPay();
    }
  }

  function handleUnwantedPay() {
    // set the consequence text to the give description text
    setConsequenceText(`The ${playerLocation} is not interested in your gold.`);

    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function handleAcceptedPay() {
    // Get the "give" description for the item -- this will be the consequence text
    const customDescription =
      locations[playerLocation].payDescription &&
      locations[playerLocation].payDescription({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    const description = customDescription || `You pay the ${playerLocation}.`;

    // Get any effect on the game state
    const customGameEffect =
      locations[playerLocation].payGameStateEffect &&
      locations[playerLocation].payGameStateEffect({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    if (customGameEffect) {
      setGameState({ ...gameState, ...customGameEffect });
    }

    const locationEffect =
      locations[playerLocation].payItemLocationEffect &&
      locations[playerLocation].payItemLocationEffect({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    if (locationEffect) {
      moveItem(locationEffect);
    }

    // set the consequence text to the give description text
    setConsequenceText(description);

    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function handleGive(item) {
    // If "give" is not handled, you can't give
    if (
      (allItems[item].getCustomGiveDescription &&
        allItems[item].getCustomGiveDescription({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        })) ||
      (allItems[item].getCustomGiveLocation &&
        allItems[item].getCustomGiveLocation({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        })) ||
      (allItems[item].getCustomGiveGameEffect &&
        allItems[item].getCustomGiveGameEffect({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        })) ||
      (allItems[item].getCustomGiveItemLocationEffect &&
        allItems[item].getCustomGiveItemLocationEffect({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        }))
    ) {
      handleAcceptedGive(item);
    } else {
      handleUnwantedGive();
    }
  }

  function handleUnwantedGive() {
    // set the consequence text to the give description text
    setConsequenceText(`The ${playerLocation} does not want this item.`);

    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function handleAcceptedGive(item) {
    // Get the "give" description for the item -- this will be the consequence text
    const customDescription =
      allItems[item].getCustomGiveDescription &&
      allItems[item].getCustomGiveDescription({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    const description =
      customDescription || `You give the ${item} to the ${playerLocation}.`;

    // Get the "drop" end location for the item -- will usually be the current player location
    const customItemLocation =
      allItems[item].getCustomGiveLocation &&
      allItems[item].getCustomGiveLocation({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    const endItemLocation = customItemLocation || "outOfPlay";

    console.log(`give to ${endItemLocation}`);

    // Determine if another item should also move
    const giveItemLocationEffect =
      allItems[item].getCustomGiveItemLocationEffect &&
      allItems[item].getCustomGiveItemLocationEffect({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    // Get any effect on the game state
    const customGameEffect =
      allItems[item].getCustomGiveGameEffect &&
      allItems[item].getCustomGiveGameEffect({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    if (customGameEffect) {
      setGameState({ ...gameState, ...customGameEffect });
    }

    // Set the item location from the inventory to the new location
    moveItem({
      item: item,
      oldLocation: "inventory",
      newLocation: endItemLocation,
    });

    if (giveItemLocationEffect) {
      moveItem(giveItemLocationEffect);
    }

    // set the consequence text to the give description text
    setConsequenceText(description);

    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function LocationItems({ itemsAtLocation }) {
    return Array.from(itemsAtLocation).map((item) => {
      return (
        <button onClick={(e) => handleTake(item)} className="item" key={item}>
          {allItems[item].displayName ? allItems[item].displayName : item}
        </button>
      );
    });
  }

  function InventoryItems({ itemsInInventory }) {
    return Array.from(itemsInInventory).map((item) => {
      return (
        <div className="inventoryItem" key={item}>
          <div key={item}>
            {allItems[item].getDescription({
              playerLocation: playerLocation,
              gameState: gameState,
              itemLocations: itemLocations,
            })}
          </div>
          <button
            onClick={(e) => handleUse(item)}
            className="item-action"
            key={item + "-use"}
          >
            {allItems[item].getUseVerb({
              playerLocation: playerLocation,
              gameState: gameState,
              itemLocations: itemLocations,
            })}
          </button>
          <button
            onClick={(e) => handleDrop(item)}
            className="item-action"
            key={item + "-drop"}
          >
            Drop
          </button>
          <button
            disabled={
              !locations[playerLocation].getSentient({
                gameState: gameState,
                playerLocation: playerLocation,
                itemLocations: itemLocations,
              })
            }
            onClick={(e) => handleGive(item)}
            className="item-action"
            key={item + "-give"}
          >
            Give
          </button>
        </div>
      );
    });
  }

  function Connections({ connections }) {
    return connections.map((connection) => {
      return (
        <button
          className="connection"
          key={connection}
          onClick={(e) => handleMovePlayer(connection)}
        >
          {locations[connection].getDisplayName({
            playerLocation: playerLocation,
            gameState: gameState,
            itemLocations: itemLocations,
          })
            ? locations[connection].getDisplayName({
                playerLocation: playerLocation,
                gameState: gameState,
                itemLocations: itemLocations,
              })
            : connection}
        </button>
      );
    });
  }

  function Location() {
    return (
      <div className="App">
        <div className="description">
          {locations[playerLocation].getDescription({
            playerLocation: playerLocation,
            gameState: gameState,
            itemLocations: itemLocations,
          })}
        </div>
        <div className="buttons">
          <LocationItems itemsAtLocation={itemLocations[playerLocation]} />
          <Connections
            connections={locations[playerLocation].getConnections({
              playerLocation: playerLocation,
              gameState: gameState,
              itemLocations: itemLocations,
            })}
          />
          <button
            className="inventory"
            onClick={(e) => setCurrentDisplay("inventory")}
          >
            Inventory
          </button>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="statName">Reputation: </div>
            <div className="statValue">{gameState.reputation}</div>
          </div>
          <div className="stat">
            <div className="statName">Gold: </div>
            <div className="statValue">{gameState.gold}</div>
          </div>
        </div>
      </div>
    );
  }

  function Consequence() {
    return (
      <div className="App">
        <div className="description">{consequenceText}</div>
        <button
          className="close"
          onClick={(e) => setCurrentDisplay("location")}
        >
          Back to{" "}
          {locations[playerLocation].getDisplayName({
            playerLocation: playerLocation,
            gameState: gameState,
            itemLocations: itemLocations,
          })
            ? locations[playerLocation].getDisplayName({
                playerLocation: playerLocation,
                gameState: gameState,
                itemLocations: itemLocations,
              })
            : playerLocation}
        </button>
        <button
          className="inventory"
          onClick={(e) => setCurrentDisplay("inventory")}
        >
          Inventory
        </button>
      </div>
    );
  }

  function Inventory() {
    return (
      <div className="App">
        <div className="description" key="description">
          Inventory
        </div>
        <div className="inventoryItems">
          <InventoryItems itemsInInventory={itemLocations.inventory} />
          <div className="inventoryItem" key="gold">
            <div key="gold">{gameState.gold + " gold"}</div>
            <button
              disabled={
                !locations[playerLocation].getSentient({
                  gameState: gameState,
                  playerLocation: playerLocation,
                  itemLocations: itemLocations,
                })
              }
              onClick={(e) => handlePay()}
              className="item-action"
              key={"gold-give"}
            >
              Pay
            </button>
          </div>
        </div>
        <button
          key="back"
          className="close"
          onClick={(e) => setCurrentDisplay("location")}
        >
          Close Inventory
        </button>
      </div>
    );
  }

  switch (currentDisplay) {
    case "consequence":
      return <Consequence></Consequence>;
    case "inventory":
      return <Inventory></Inventory>;
    default:
      return <Location />;
  }
}

export default App;
