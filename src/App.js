import React, { useState } from "react";
import "./App.css";
import { projects } from "./projects.js";
import getImageLookup from "./imageLookup.js";

const imageLookup = getImageLookup();

function Project({
  name,
  id,
  description,
  site,
  code,
  activityDescription = "Play now",
  numPlayers,
  playTimeMinutes,
}) {
  const imagePath = imageLookup[id].default;

  return (
    <div className="project" key={id}>
      <h3>{name}</h3>
      <img className="icon" src={imagePath} alt={id} />
      <div id="playParameters">
        <p>{numPlayers ? numPlayers + " players" : null}</p>
        <p>{numPlayers && playTimeMinutes ? " ● " : null}</p>
        <p>{playTimeMinutes ? playTimeMinutes + " min" : null}</p>
      </div>
      <p>{description}</p>
      <div className="links">
        <a href={site}>{activityDescription}</a>
        <div>&nbsp;●&nbsp;</div>
        <a href={code}>See code</a>
      </div>
    </div>
  );
}

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
    playedForAdolescent: false,
    promisedTreasure: false,
    cursed: false,
  };
  const [gameState, setGameState] = useState(startingState);
  const [playerLocation, setPlayerLocation] = useState("room");
  const [showConsequence, setShowConsequence] = useState(false);
  const [consequenceText, setConsequenceText] = useState("");
  const [showInventory, setShowInventory] = useState(false);

  // todo could build programatically...if can remove circular dependency or need test to confirm matches
  const startingItemLocations = {
    room: new Set(["lute"]),
    window: new Set([]),
    wardrobe: new Set(["clothes"]),
    mirror: new Set([]),
    inn: new Set(["apple", "knife"]),
    courtyard: new Set([]),
    inventory: new Set([]),
  };

  const [itemLocations, setItemLocations] = useState(startingItemLocations);

  const locations = {
    room: {
      description: `You are in a room with a bed. A window faces the west. A wardrobe sits on the north side of the room, opposite a door. ${itemLocations.room.has("lute") ? "A lute leans against the bed. " : ""
        }${gameState.fire
          ? "You smell fire and hear screams in the distance. "
          : ""
        }`,
      connections: ["window", "wardrobe", "inn"],
    },
    window: {
      description: `${gameState.fire
          ? "Through the window, you see flames and smoke coming from a nearby mansion. A crowd has gathered in front of the mansion."
          : "Through the window, you see the charred remains of a nearby mansion."
        }`,
      connections: ["room"],
    },
    wardrobe: {
      description: `Inside the wardrobe, there is a mirror ${itemLocations.wardrobe.has("clothes") ? "and a set of clothes" : ""
        }.`,
      connections: ["room", "mirror"],
    },
    mirror: {
      // todo could also handle poopy, singed. Would need to use multiple ternary expressions.
      description: `${gameState.naked
          ? "You're naked!"
          : "You are quite good looking, if you say so yourself."
        }`,
      connections: ["wardrobe"],
    },
    inn: {
      description: `You enter what appears to be the common room of an inn. ${itemLocations.inn.has("apple") ? "A complementary apple rests on the table. " : ""}${gameState.naked ? 'The inn keeper laughs, "Haven\'t you heard of clothes?!"' : ""}`,
      connections: ["room", "courtyard"],
      // If you are naked, lose reputation when you move here
      ... (gameState.naked && { enterSideEffect: { reputation: gameState.reputation - 1 } })
    },
    courtyard: {
      description: "A nice fountain",
      connections: ["inn"],
    },
  };

  const items = {
    lute: {
      spawnLocation: "room",
      description: "A wooden lute",
      ...(playerLocation == "inn" && {
        takeDescription: "The lute feels familiar",
        takeLocation: "inn",
      }),
      ...(false && { takeDescription: "falsy" }),
      useVerb: "Play",
      useDescription: "the desc for use",
    },
    clothes: {
      spawnLocation: "wardrobe",
      description: "A set of clothes",
      useVerb: "Wear", // todo not if already on?
      useDescription: "the desc for use",
    },
    apple: {
      spawnLocation: "inn",
      description: "A crisp apple",
      useVerb: "Eat",
      useDescription: "the desc for use",
    },
    knife: {
      spawnLocation: "inn",
      description: "A knife",
      useVerb: "Attack",
      useDescription: "the desc for use",
    },
  };

  function buildStartingLocations() {
    let startingItemLocations = {};

    Object.keys(locations).forEach(
      (location) => (startingItemLocations[location] = new Set())
    );

    for (const [item, itemInfo] of Object.entries(items)) {
      startingItemLocations[itemInfo.spawnLocation].add(item)
    }

    return startingItemLocations;
  }

  buildStartingLocations();

  function moveItem(item, oldLocation, newLocation) {
    itemLocations[oldLocation].delete(item);
    itemLocations[newLocation].add(item);
    setItemLocations(itemLocations);
  }

  function handleTake(item) {
    // Get the "take"" description for the item -- this will be the consequence text
    const description = items[item].takeDescription
      ? items[item].takeDescription
      : `You now have ${item}`;

    // Get the "take" end location for the item -- will usually be "inventory"
    const endItemLocation = items[item].takeLocation
      ? items[item].takeLocation
      : "inventory";

    // Set the item location to the take end location
    moveItem(item, playerLocation, endItemLocation);

    // set the consequence text to the take description text
    setConsequenceText(description);

    // set show consequence to true
    setShowConsequence(true);
  }

  function handleUse(item) {
    const description = items[item].useDescription
      ? items[item].useDescription
      : `You use the ${item}.`;
  }

  function LocationItems({ items }) {
    return Array.from(items).map((item) => {
      return (
        <button onClick={(e) => handleTake(item)} className="item" key={item}>
          {item}
        </button>
      );
    });
  }

  function InventoryItems({ items }) {
    // todo inventory items have different action than take
    return Array.from(items).map((item) => {
      return (
        <button onClick={(e) => handleTake(item)} className="item" key={item}>
          {item}
        </button>
      );
    });
  }

  function handleMovePlayer(newLocation) {
    if (locations[newLocation].enterSideEffect) {
      setGameState({ ...gameState, ...locations[newLocation].enterSideEffect })
    }

    setPlayerLocation(newLocation)
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
        <div className="location">{playerLocation}</div>
        <div className="description">
          {locations[playerLocation]["description"]}
        </div>
        <LocationItems items={itemLocations[playerLocation]} />
        <Connections connections={locations[playerLocation]["connections"]} />
        <button className="inventory" onClick={(e) => setShowInventory(true)}>
          Inventory
        </button>
        <div>{gameState.reputation}</div>
      </div>
    );
  }

  function Consequence() {
    return (
      <div className="App">
        <div className="description">{consequenceText}</div>
        <button onClick={(e) => setShowConsequence(false)}>
          {playerLocation}
        </button>
      </div>
    );
  }

  function Inventory() {
    return (
      <div className="App">
        <div className="description">Inventory</div>
        <InventoryItems items={itemLocations["inventory"]} />
        <button onClick={(e) => setShowInventory(false)}>Back</button>
      </div>
    );
  }

  const displays = projects.map((project) => {
    return Project(project);
  });

  if (showConsequence) {
    return <Consequence></Consequence>;
  } else if (showInventory) {
    return <Inventory></Inventory>;
  } else {
    return <Location />;
  }
}

export default App;
