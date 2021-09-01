import React, { useState } from "react";
import "./App.css";

function App() {
  const startingState = {
    reputation: 10,
    gold: 0,
    timeInCave: 0,
    unsinged: ["eyebrows", "hair", "nose", "ears", "neck"],
    singed: [],
    swordCost: 50,
    fire: true,
    naked: true,
    squirrelDead: false,
    horseDead: false,
    horseTethered: false,
    horseMounted: false,
    poisoned: false,
    dragonAsleep: false,
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
  };
  const [gameState, setGameState] = useState(startingState);
  const [playerLocation, setPlayerLocation] = useState("room");
  const [consequenceText, setConsequenceText] = useState("");
  const [currentDisplay, setCurrentDisplay] = useState("location"); // location | inventory | consequence

  // todo could build programatically...if can remove circular dependency or need test to confirm matches
  const startingItemLocations = {
    inventory: new Set([]),
    outOfPlay: new Set([]),
    room: new Set(["lute"]),
    window: new Set([]),
    wardrobe: new Set(["clothes"]),
    mirror: new Set([]),
    inn: new Set(["apple"]),
    courtyard: new Set(["handkerchief"]),
    adolescent: new Set([]),
    fountain: new Set([]),
    nursery: new Set(["baby"]),
  };

  const [itemLocations, setItemLocations] = useState(startingItemLocations);

  const locations = {
    room: {
      description: `You are in a room with a bed. A window faces the west. A wardrobe sits on the north side of the room, opposite a door. ${itemLocations.room.has("lute") ? "A lute leans against the bed. " : ""
        }${gameState.fire
          ? "You smell fire and hear screams in the distance. "
          : ""
        }`,
      connections: ["window", "wardrobe", "inn"], //todo could say door instead of inn if used alias
      dropProposition: "in", //todo use this when drop. also check that word propositino is correct
    },
    window: {
      description: `${gameState.fire
        ? "Through the window, you see flames and smoke coming from a nearby mansion. A crowd has gathered in front of the mansion."
        : "Through the window, you see the charred remains of a nearby mansion."
        }`,
      connections: ["room"],
      dropProposition: "at",
    },
    wardrobe: {
      description: `Inside the wardrobe, there is a mirror ${itemLocations.wardrobe.has("clothes") ? "and a set of clothes" : ""
        }.`,
      connections: ["room", "mirror"],
      dropProposition: "in",
    },
    mirror: {
      // todo could also handle poopy, singed. Would need to use multiple ternary expressions.
      description: `${gameState.naked
        ? "You're naked!"
        : "You are quite good looking, if you say so yourself."
        }`,
      connections: ["wardrobe"],
      dropProposition: "at",
    },
    inn: {
      description: `You enter what appears to be the common room of an inn. ${itemLocations.inn.has("apple")
        ? "A complementary apple rests on the table. "
        : ""
        }${gameState.naked
          ? 'The inn keeper laughs, "Haven\'t you heard of clothes?!"'
          : ""
        }`,
      connections: ["room", "courtyard"],
      dropProposition: "in",
      // If you are naked, lose reputation when you move here
      ...(gameState.naked && {
        onEnterGameStateEffect: { reputation: gameState.reputation - 1 },
      }),
    },
    courtyard: {
      description: `You are in a small courtyard. The entrance to the inn sits at the north side. To the east you hear sounds of a blacksmith shop. To the west you see a fountain. ${gameState.fire ? "Beyond the fountain, you see flames and smoke. " : ""
        }${gameState.firstCourtyardEntry
          ? "An adolescent runs west to east, crying as they flee. They drop a handkerchief in their distress. "
          : ""
        }`,
      connections: ["inn", "fountain", "smithy"],
      dropProposition: "in",
      ...(gameState.firstCourtyardEntry && {
        onExitGameStateEffect: { firstCourtyardEntry: false },
      })
    },
    fountain: {
      connections: ["manor", "courtyard"],
      dropProposition: "in",
      description: `You stand at the edge of a fountain. In the center is a statue of a dragon surrounded by cowering people. To the east is a courtyard. To the north is a manor. ${gameState.fire
        ? "The manor is on fire and surrounded by a crowd of people. "
        : "The manor is a framework of charred wood."
        }${itemLocations.nursery.has("baby")
          ? 'You hear a voice sobbing, "My baby! My baby is trapped in the nursery."'
          : ""
        }${(gameState.savedBaby && gameState.babyCough && !gameState.receivedBabyReward)
          ? 'You hear a voice: "My baby! You saved my baby! But my dear baby has a terrible cough from being carried through the smoke. Regardless, take this gold as thanks." As you take the gold and praise, you see the roof collapse. Finally, the crowd is able to douse the flames. '
          : ""
        }${(gameState.savedBaby && !gameState.babyCough && !gameState.receivedBabyReward)
          ? 'You hear a voice: "Thank you for saving my baby! Please take this gold as thanks." As you take the gold and praise, you see the roof collapse. Finally, the crowd is able to douse the flames.'
          : ""
        }`,
      ...((gameState.savedBaby && !gameState.receivedBabyReward) && {
        onExitGameStateEffect: { fire: false, receivedBabyReward: true },
        onEnterItemLocationEffect: { item: "baby", oldLocation: "inventory", newLocation: "outOfPlay" }
      }),
      ...((gameState.savedBaby && gameState.babyCough && !gameState.receivedBabyReward) && {
        onEnterGameStateEffect: { gold: gameState.gold + 50, reputation: gameState.reputation + 1 },
      }),
      ...((gameState.savedBaby && !gameState.babyCough && !gameState.receivedBabyReward) && {
        onEnterGameStateEffect: { gold: gameState.gold + 50, reputation: gameState.reputation + 2 },
      }),

    },


  };

  const allItems = {
    lute: {
      spawnLocation: "room",
      description: "A wooden lute",
      ...(playerLocation === "inn" && {
        takeDescription: "The lute feels familiar",
        takeLocation: "inn",
      }),
      ...(false && { takeDescription: "falsy" }),
      useVerb: "Play",
      useDescription: "You play a beautiful melody.",
    },
    clothes: {
      spawnLocation: "wardrobe",
      description: "A set of clothes",
      ...(gameState.naked
        ? {
          useVerb: "Wear",
          useDescription: "You put on the clothes.",
          useSideEffect: { naked: false },
        }
        : {
          useVerb: "Remove",
          useDescription: "You strip down.",
          useSideEffect: { naked: true },
        }),
    },
    apple: {
      spawnLocation: "inn",
      description: "A crisp apple",
      useVerb: "Eat",
      useDescription: "the desc for use",
    },
    handkerchief: {
      spawnLocation: "adolescent",
      ...(gameState.handkerchiefDamp
        ? {
          description: "A damp handkerchief",
        }
        : {
          description: "A handkerchief",
        }),
      ...(gameState.masked
        ? {
          useVerb: "Remove",
          useDescription:
            "You remove the handkerchief from your nose and mouth.",
          useSideEffect: { masked: false },
        }
        : {
          useVerb: "Wear",
          useDescription:
            "You tie the handkerchief around your nose and mouth.",
          useSideEffect: { masked: true },
        }),
    },
    baby: {
      spawnLocation: "nursery",
      description: "A crying baby",
      useVerb: "Use",
      useDescription: "It's unclear what use this item has.",
    },
    milk: {
      spawnLocation: "inn",
      description: "A knife",
      useVerb: "Attack",
      useDescription: "the desc for use",
    },
  };

  // function buildStartingLocations() {
  //   const startingItemLocations = {};

  //   Object.keys(locations).forEach(
  //     (location) => (startingItemLocations[location] = new Set())
  //   );

  //   for (const [item, itemInfo] of Object.entries(allItems)) {
  //     startingItemLocations[itemInfo.spawnLocation].add(item);
  //   }

  //   return startingItemLocations;
  // }

  // buildStartingLocations();

  function moveItem({ item, oldLocation, newLocation }) {
    itemLocations[oldLocation].delete(item);
    itemLocations[newLocation].add(item);
    setItemLocations(itemLocations);
  }

  function handleMovePlayer(newLocation) {
    let gameStateChanges = {}

    const oldLocation = playerLocation;
    if (locations[oldLocation].onExitGameStateEffect) {
      gameStateChanges = {
        ...gameStateChanges,
        ...locations[oldLocation].onExitGameStateEffect,
      };
    }

    if (locations[newLocation].onEnterGameStateEffect) {
      gameStateChanges = {
        ...gameStateChanges,
        ...locations[newLocation].onEnterGameStateEffect,
      };
    }

    if (Object.keys(gameStateChanges).length) {
      setGameState({
        ...gameState,
        ...gameStateChanges,
      });
    }

    if (locations[newLocation].onEnterItemLocationEffect) {
      moveItem(locations[newLocation].onEnterItemLocationEffect);
    }

    setPlayerLocation(newLocation);
  }

  function handleTake(item) {
    // Get the "take"" description for the item -- this will be the consequence text
    const description = allItems[item].takeDescription
      ? allItems[item].takeDescription
      : `You now have ${item}`;

    // Get the "take" end location for the item -- will usually be "inventory"
    const endItemLocation = allItems[item].takeLocation
      ? allItems[item].takeLocation
      : "inventory";

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
    const description = allItems[item].useDescription
      ? allItems[item].useDescription
      : `You use the ${item}.`;

    if (allItems[item].useSideEffect) {
      setGameState({ ...gameState, ...allItems[item].useSideEffect });
    }

    // set the consequence text to the take description text
    setConsequenceText(description);

    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function handleDrop(item) {
    // Get the "drop"" description for the item -- this will be the consequence text
    const description = allItems[item].dropDescription
      ? allItems[item].dropDescription
      : `You drop ${item} at ${playerLocation}`;

    // Get the "drop" end location for the item -- will usually be the current player location
    const endItemLocation = allItems[item].dropLocation
      ? allItems[item].dropLocation
      : playerLocation;

    if (allItems[item].dropSideEffect) {
      setGameState({ ...gameState, ...allItems[item].dropSideEffect });
    }

    // Set the item location from the inventory to the new location
    moveItem(item, "inventory", endItemLocation);

    // set the consequence text to the take description text
    setConsequenceText(description);

    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function LocationItems({ itemsAtLocation }) {
    return Array.from(itemsAtLocation).map((item) => {
      return (
        <button onClick={(e) => handleTake(item)} className="item" key={item}>
          {item}
        </button>
      );
    });
  }

  function InventoryItems({ itemsInInventory }) {
    // todo inventory items have different action than take
    return Array.from(itemsInInventory).map((item) => {
      return (
        <div key={item}>
          <div key={item}>{item}</div>
          <button
            onClick={(e) => handleUse(item)}
            className="item"
            key={item + "-use"}
          >
            {allItems[item].useVerb}
          </button>
          <button
            onClick={(e) => handleDrop(item)}
            className="item"
            key={item + "-drop"}
          >
            Drop
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
          {connection}
        </button>
      );
    });
  }

  function Location() {
    return (
      <div className="App">
        <div className="description">
          {locations[playerLocation].description}
        </div>
        <LocationItems itemsAtLocation={itemLocations[playerLocation]} />
        <Connections connections={locations[playerLocation].connections} />
        <button
          className="inventory"
          onClick={(e) => setCurrentDisplay("inventory")}
        >
          Inventory
        </button>
        <div>Reputation: {gameState.reputation}</div>
        <div>Gold: {gameState.gold}</div>
      </div>
    );
  }

  function Consequence() {
    return (
      <div className="App">
        <div className="description">{consequenceText}</div>
        <button onClick={(e) => setCurrentDisplay("location")}>
          Back to {playerLocation}
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
        <InventoryItems itemsInInventory={itemLocations.inventory} />
        <button key="back" onClick={(e) => setCurrentDisplay("location")}>
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
