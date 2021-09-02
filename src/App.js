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
    ownSword: false,
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
    manor: new Set([]),
    nursery: new Set(["baby"]),
    nurseryWindow: new Set([]),
    smithy: new Set(["sword"]),
    blacksmith: new Set([]),
    southGate: new Set(["horse"]),
    northGate: new Set([]),
  };

  const [itemLocations, setItemLocations] = useState(startingItemLocations);

  // todo add tests that locations and items have required values

  // todo convert to objects with methods, pass itemLocations/game to remove circular dependency
  const locations = {
    room: {
      description: `You are in a room with a bed. A window faces the west. A wardrobe sits on the north side of the room, opposite a door. ${
        itemLocations.room.has("lute") ? "A lute leans against the bed. " : ""
      }${
        gameState.fire
          ? "You smell fire and hear screams in the distance. "
          : ""
      }`,
      connections: ["window", "wardrobe", "inn"], //todo could say door instead of inn if used alias
      dropProposition: "in", //todo use this when drop. also check that word propositino is correct
    },
    window: {
      description: `${
        gameState.fire
          ? "Through the window, you see flames and smoke coming from a nearby mansion. A crowd has gathered in front of the mansion."
          : "Through the window, you see the charred remains of a nearby mansion."
      }`,
      connections: ["room"],
      dropProposition: "at",
    },
    wardrobe: {
      description: `Inside the wardrobe, there is a mirror ${
        itemLocations.wardrobe.has("clothes") ? "and a set of clothes" : ""
      }.`,
      connections: ["room", "mirror"],
      dropProposition: "in",
    },
    mirror: {
      // todo could also handle poopy, singed. Would need to use multiple ternary expressions.
      description: `${
        gameState.naked
          ? "You're naked!"
          : "You are quite good looking, if you say so yourself."
      }`,
      connections: ["wardrobe"],
      dropProposition: "at",
    },
    inn: {
      description: `You enter what appears to be the common room of an inn. ${
        itemLocations.inn.has("apple")
          ? "A complementary apple rests on the table. "
          : ""
      }${
        gameState.naked
          ? 'The inn keeper laughs, "Haven\'t you heard of clothes?!"'
          : ""
      }`,
      connections: ["room", "courtyard"],
      dropProposition: "in",
      ...(gameState.naked && {
        onEnterGameStateEffect: { reputation: gameState.reputation - 1 },
      }),
    },
    courtyard: {
      description: `You are in a small courtyard. The entrance to the inn sits at the north side. To the east you hear sounds of a blacksmith shop. To the west you see a fountain. ${
        gameState.fire ? "Beyond the fountain, you see flames and smoke. " : ""
      }${
        gameState.firstCourtyardEntry
          ? "An adolescent runs west to east, crying as they flee. They drop a handkerchief in their distress. "
          : ""
      }`,
      connections: ["inn", "fountain", "smithy"],
      dropProposition: "in",
      ...(gameState.firstCourtyardEntry && {
        onExitGameStateEffect: { firstCourtyardEntry: false },
      }),
    },
    fountain: {
      connections: ["manor", "courtyard"],
      dropProposition: "in",
      description: `You stand at the edge of a fountain. In the center is a statue of a dragon surrounded by cowering people. To the east is a courtyard. To the north is a manor. ${
        gameState.fire
          ? "The manor is on fire and surrounded by a crowd of people. "
          : "The manor is a framework of charred wood."
      }${
        itemLocations.nursery.has("baby")
          ? 'You hear a voice sobbing, "My baby! My baby is trapped in the nursery."'
          : ""
      }${
        gameState.savedBaby &&
        gameState.babyCough &&
        !gameState.receivedBabyReward
          ? 'You hear a voice: "My baby! You saved my baby! But my dear baby has a terrible cough from being carried through the smoke. Regardless, take this gold as thanks." As you take the gold and praise, you see the roof collapse. Finally, the crowd is able to douse the flames. '
          : ""
      }${
        gameState.savedBaby &&
        !gameState.babyCough &&
        !gameState.receivedBabyReward
          ? 'You hear a voice: "Thank you for saving my baby! Please take this gold as thanks." As you take the gold and praise, you see the roof collapse. Finally, the crowd is able to douse the flames.'
          : ""
      }`,
      // todo could use consequence instead of on enter and on exit
      // ...((gameState.savedBaby && !gameState.receivedBabyReward) && {
      //   consequenceText: "",
      //   consequenceStateEffect: {
      //     fire: false,
      //     receivedBabyReward: true
      //   },
      //   consequenceItemLocationEffect: {}
      // }),
      ...(gameState.savedBaby &&
        !gameState.receivedBabyReward && {
          onExitGameStateEffect: { fire: false, receivedBabyReward: true },
          onEnterItemLocationEffect: {
            item: "baby",
            oldLocation: "inventory",
            newLocation: "outOfPlay",
          },
        }),
      ...(gameState.savedBaby &&
        !gameState.receivedBabyReward && {
          onEnterGameStateEffect: {
            gold: gameState.gold + 50,
            reputation: gameState.babyCough
              ? gameState.reputation + 1
              : gameState.reputation + 2,
          },
        }),
    },
    manor: {
      connections: ["fountain"], //todo could instead allow to continue if not masked but develop cough/lose reputation. todo could instead allow to continue if no fire but have manor collapse
      ...(gameState.fire &&
        gameState.handkerchiefDamp &&
        gameState.masked && { connections: ["fountain", "nursery"] }),
      dropProposition: "in",
      description: `${
        gameState.fire
          ? "You stand in the entrance of the burning manor. "
          : "You stand in the charred remains of the manor. "
      }${
        itemLocations.nursery.has("baby")
          ? "You hear a baby crying upstairs. "
          : ""
      }${
        gameState.fire && (!gameState.handkerchiefDamp || !gameState.masked)
          ? "Your throat burns from the smoke and heat. You can't breath this air. "
          : ""
      }${
        gameState.fire && gameState.handkerchiefDamp && gameState.masked
          ? "Although the smoke is thick, the damp handkerchief over your mouth helps you breath."
          : ""
      }`,
      ...(itemLocations.inventory.has("baby") && {
        onEnterGameStateEffect: { babyCough: true },
      }),
      // ...((gameState.fire && !gameState.handkerchiefDamp && !gameState.masked) && {
      //   consequenceText: "Your throat burns from the smoke and heat. You can't breath this air. You retreat back outside",
      //   consequencePlayerLocationEffect: "fountain",
      // }),
    },
    nursery: {
      connections: ["nurseryWindow", "manor"],
      dropProposition: "in",
      description: `${
        (gameState.fire && itemLocations.nursery.has("baby"))
          ? "You stand in a nursery. You see a baby wailing in the crib under an open window. The open window must be the only thing keeping the baby alive in this smoke. "
          : ""
      }${
        (gameState.fire && !itemLocations.nursery.has("baby"))
          ? "You stand in a nursery with an empty crib. The fire continues to burn, pouring smoke into the room. "
          : ""
      }${
        !gameState.fire ? "You stand in the charred remains of a nursery." : ""
      }`,
    },
    nurseryWindow: {
      connections: ["nursery"],
      dropProposition: "at", // todo could change to out and have anything dropped out any window end in location below
      description: `${
        gameState.fire
          ? "Below the window, you see the gathered crowd. "
          : "You see the charred remains of the manor below you. "
      }`,
    },
    smithy: {
      connections: ["courtyard", "blacksmith", "northGate", "southGate"],
      dropProposition: "at",
      description: `You stand in front of a blacksmith shop. To the north and south are city gates. To the west is a courtyard. The blacksmith is working inside the shop. ${
        itemLocations.smithy.has("sword")
          ? "In front of the shop, you see a sword gleaming as if someone was recently polishing it."
          : ""
      }`,
    },
    blacksmith: {
      connections: ["smithy"],
      dropProposition: "at",
      description: `The blacksmith looks up as you walk in. ${!gameState.ownSword ? `"Are you interested in buying that sword? It costs ${gameState.swordCost}gold${itemLocations.inventory.has("lute") ? ' or I would trade it for your lute' : ""}. ` : ""}`,
    },
    southGate: {
      connections: ["smithy"],
      dropProposition: "at",
      description: `You are standing at the south gate, which opens to a wide field. There is no road in sight. To the north, you hear sounds of the blacksmith shop. ${itemLocations.southGate.has("horse") ? 'A horse is grazing in the field. A sign reads: "Free horse (if you can catch it)."' : ""}`,
    },
    northGate: {},
  };

  const allItems = {
    lute: {
      spawnLocation: "room",
      description: "a wooden lute",
      ...(playerLocation === "room" && {
        takeDescription: "The lute feels familiar.",
      }),
      useVerb: "Play",
      useDescription: "You play a beautiful melody.",
    },
    clothes: {
      spawnLocation: "wardrobe",
      description: "a set of clothes",
      ...(gameState.naked
        ? {
            useVerb: "Wear",
            useDescription: "You put on the clothes.",
            useGameStateEffect: { naked: false },
          }
        : {
            useVerb: "Remove",
            useDescription: "You strip down.",
            useGameStateEffect: { naked: true },
          }),
    },
    apple: {
      spawnLocation: "inn",
      description: "a fresh apple",
      useVerb: "Eat",
      useDescription: "the desc for use",
    },
    handkerchief: {
      spawnLocation: "adolescent",
      ...(gameState.handkerchiefDamp
        ? {
            description: "a damp handkerchief",
          }
        : {
            description: "a handkerchief",
          }),
      ...(gameState.masked
        ? {
            useVerb: "Remove",
            useDescription:
              "You remove the handkerchief from your nose and mouth.",
            useGameStateEffect: { masked: false },
          }
        : {
            useVerb: "Wear",
            useDescription:
              "You tie the handkerchief around your nose and mouth.",
            useGameStateEffect: { masked: true },
          }),
      ...(playerLocation === "fountain" && {
        dropGameStateEffect: { handkerchiefDamp: true },
      }),
    },
    baby: {
      spawnLocation: "nursery",
      description: "a crying baby",
      useVerb: "Use",
      useDescription: "It's unclear what use this item has. ",
      dropDescription: "You drop the crying baby. It cries even louder. ",
      ...(playerLocation === "nursery" && {
        takeDescription:
          "You pick up the baby from the crib. The baby coughs as you move it away from the open window. ",
        dropDescription: "You place the baby back in the crib. ",
      }),
      takeGameStateEffect: { savedBaby: true },
      ...(!playerLocation === "nurseryWindow" && {
        dropGameStateEffect: { savedBaby: false },
      }),

      ...(playerLocation === "nurseryWindow" && {
        dropDescription:
          "You drop the baby out of the open window. The crowd below catches the baby. ",
        dropLocation: "outOfPlay",
      }),
    },
    sword: {
      // todo need to add "Admire" action: if sword location is blacksmith shop: You admire the sword. The smith sees you admiring the sword. "Fine piece of work, eh? It costs 50, but I'll sell it for 40. cost -10 gold.
      spawnLocation: "smithy",
      description: "a sword",
      useVerb: "Attack",
      useDescription:
        "You slash the sword through the air, looking a bit foolish.", // todo have alt if at dragon
      ...(playerLocation === "smithy" &&
        !gameState.ownSword && {
          takeDescription:
            'You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The blacksmith shop grabs the sword from you and returns it to the table.',
          takeLocation: "smithy",
          takeGameStateEffect: { reputation: gameState.reputation - 1 },
        }),
    },
    horse: {
      spawnLocation: "southGate",
      description: "a voracious horse",
      dropDescription: "You let go of the horse's reins. The horse trots away, probably in search of grass to munch.", // todo make sure cannot catch horse again?
      dropGameStateEffect: {horseTethered: false},
      ...(gameState.horseMounted ? {
        useVerb: "Unmount",
        useDescription: "You unmount the horse, keeping hold of the horse's reins.",
        useGameStateEffect: {horseMounted: false},
        dropDescription: "You unmount the horse and let go of the horse's reins."
      } : {
        useVerb: "Mount",
        useDescription: "You mount the horse. Much easier than walking!",
        useGameStateEffect: {horseMounted: true}
      }),
      // ...(playerLocation === "clearing" ? {dropDescription} : "") todo stopped here
    }
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

  function giveConsequence({ description }) {}

  function moveItem({ item, oldLocation, newLocation }) {
    console.log(`'moving' ${item} from ${oldLocation} to ${newLocation}`);
    itemLocations[oldLocation].delete(item);
    itemLocations[newLocation].add(item);
    setItemLocations(itemLocations);
  }

  function handleMovePlayer(newLocation) {
    let gameStateChanges = {};

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

    if (locations[oldLocation].onExitItemLocationEffect) {
      moveItem(locations[oldLocation].onExitItemLocationEffect);
    }

    setPlayerLocation(newLocation);
  }

  function handleTake(item) {
    console.log(`handkerchief is damp ${gameState.handkerchiefDamp}`);
    // Get the "take"" description for the item -- this will be the consequence text
    const description = allItems[item].takeDescription
      ? allItems[item].takeDescription
      : `You now have ${allItems[item].description}`;

    // Get the "take" end location for the item -- will usually be "inventory"
    const endItemLocation = allItems[item].takeLocation
      ? allItems[item].takeLocation
      : "inventory";

    if (allItems[item].takeGameStateEffect) {
      setGameState({ ...gameState, ...allItems[item].takeGameStateEffect });
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
    const description = allItems[item].useDescription
      ? allItems[item].useDescription
      : `You use the ${item}.`;

    if (allItems[item].useGameStateEffect) {
      setGameState({ ...gameState, ...allItems[item].useGameStateEffect });
    }

    // set the consequence text to the use description text
    setConsequenceText(description);

    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function handleDrop(item) {
    // Get the "drop"" description for the item -- this will be the consequence text
    const description = allItems[item].dropDescription
      ? allItems[item].dropDescription
      : `You drop the ${item} ${locations[playerLocation].dropProposition} the ${playerLocation}`;

    // Get the "drop" end location for the item -- will usually be the current player location
    const endItemLocation = allItems[item].dropLocation
      ? allItems[item].dropLocation
      : playerLocation;

    console.log(`drop at ${endItemLocation}`);

    if (allItems[item].dropGameStateEffect) {
      setGameState({ ...gameState, ...allItems[item].dropGameStateEffect });
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
    return Array.from(itemsInInventory).map((item) => {
      return (
        <div className="inventoryItem" key={item}>
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
