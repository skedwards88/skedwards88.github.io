import React, { useState } from "react";
import "./App.css";

function App() {
  const startingState = {
    reputation: 10,
    gold: 400,
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
  const [gameState, setGameState] = useState(startingState);
  const [playerLocation, setPlayerLocation] = useState("lair");
  const [consequenceText, setConsequenceText] = useState("");
  const [currentDisplay, setCurrentDisplay] = useState("location"); // location | inventory | consequence

  // todo could build programatically...if can remove circular dependency or need test to confirm matches
  const startingItemLocations = {
    inventory: new Set(["sword"]),
    outOfPlay: new Set([]),
    room: new Set(["lute"]),
    window: new Set([]),
    wardrobe: new Set(["clothes"]),
    mirror: new Set([]),
    inn: new Set(["apple"]),
    courtyard: new Set(["handkerchief"]),
    fountain: new Set([]),
    manor: new Set([]),
    nursery: new Set(["baby"]),
    nurseryWindow: new Set([]),
    smithy: new Set(["sword"]),
    blacksmith: new Set([]),
    pasture: new Set(["horse"]),
    northGate: new Set([]),
    adolescent: new Set([]),
    road: new Set([]),
    stream: new Set([]),
    clearing: new Set(["berries"]),
    squirrel: new Set([]),
    wizard: new Set([]),
    cliff: new Set([]),
    caveEntrance: new Set([]),
    dung: new Set([]),
    puddle: new Set([]),
    boulder: new Set([]),
    lair: new Set(["treasure"]),
  };

  const [itemLocations, setItemLocations] = useState(startingItemLocations);

  // todo add tests that locations and items have required values

  // todo convert to objects with methods, pass itemLocations/game to remove circular dependency
  const locations = {
    room: {
      displayName: "Room",
      description: `You are in a room with a bed. A window faces the west. A wardrobe sits on the north side of the room, opposite a door. ${
        itemLocations.room.has("lute") ? "A lute leans against the bed. " : ""
      }${
        gameState.fire
          ? "You smell fire and hear screams in the distance. "
          : ""
      }`,
      connections: ["window", "wardrobe", "inn"],
      dropPreposition: "in",
    },
    window: {
      displayName: "Window",
      description: `${
        gameState.fire
          ? "Through the window, you see flames and smoke coming from a nearby mansion. A crowd has gathered in front of the mansion."
          : "Through the window, you see the charred remains of a nearby mansion."
      }`,
      connections: ["room"],
      dropPreposition: "at",
    },
    wardrobe: {
      displayName: "Wardrobe",
      description: `Inside the wardrobe, there is a mirror ${
        itemLocations.wardrobe.has("clothes") ? "and a set of clothes" : ""
      }.`,
      connections: ["room", "mirror"],
      dropPreposition: "in",
    },
    mirror: {
      displayName: "Mirror",
      // todo could also handle poopy, singed. Would need to use multiple ternary expressions.
      description: `${
        gameState.naked
          ? "You're naked!"
          : "You are quite good looking, if you say so yourself."
      }`,
      connections: ["wardrobe"],
      dropPreposition: "at",
    },
    inn: {
      displayName: playerLocation === "room" ? "Door" : "Inn",
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
      dropPreposition: "in",
      ...(gameState.naked && {
        onEnterGameStateEffect: { reputation: gameState.reputation - 1 },
      }),
    },
    courtyard: {
      displayName: "Courtyard",
      description: `You are in a small courtyard. The entrance to the inn sits at the north side. To the east you hear sounds of a blacksmith shop. To the west you see a fountain. ${
        gameState.fire ? "Beyond the fountain, you see flames and smoke. " : ""
      }${
        gameState.firstCourtyardEntry
          ? "An adolescent runs west to east, crying as they flee. They drop a handkerchief in their distress. "
          : ""
      }`,
      connections: ["inn", "fountain", "smithy"],
      dropPreposition: "in",
      ...(gameState.firstCourtyardEntry && {
        onExitGameStateEffect: { firstCourtyardEntry: false },
      }),
    },
    fountain: {
      connections: ["manor", "courtyard"],
      dropPreposition: "in",
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
      connections: ["fountain"], // todo allow to continue if not masked but develop cough/lose reputation. todo could instead allow to continue if no fire but have manor collapse
      ...(gameState.fire &&
        gameState.handkerchiefDamp &&
        gameState.masked && { connections: ["fountain", "nursery"] }),
      dropPreposition: "in",
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
    },
    nursery: {
      connections: ["nurseryWindow", "manor"],
      dropPreposition: "in",
      description: `${
        gameState.fire && itemLocations.nursery.has("baby")
          ? "You stand in a nursery. You see a baby wailing in the crib under an open window. The open window must be the only thing keeping the baby alive in this smoke. "
          : ""
      }${
        gameState.fire && !itemLocations.nursery.has("baby")
          ? "You stand in a nursery with an empty crib. The fire continues to burn, pouring smoke into the room. "
          : ""
      }${
        !gameState.fire ? "You stand in the charred remains of a nursery." : ""
      }`,
    },
    nurseryWindow: {
      connections: ["nursery"],
      dropPreposition: "at", // todo could change to out and have anything dropped out any window end in location below
      description: `${
        gameState.fire
          ? "Below the window, you see the gathered crowd. "
          : "You see the charred remains of the manor below you. "
      }`,
    },
    smithy: {
      connections: ["courtyard", "blacksmith", "northGate", "pasture"],
      dropPreposition: "at",
      description: `You stand in front of a blacksmith shop. To the north and south are city gates. To the west is a courtyard. The blacksmith is working inside the shop. ${
        itemLocations.smithy.has("sword")
          ? "In front of the shop, you see a sword gleaming as if someone was recently polishing it."
          : ""
      }`,
    },
    blacksmith: {
      sentient: true,
      connections: ["smithy"],
      dropPreposition: "by",
      description: `The blacksmith looks up as you walk in. ${
        !gameState.ownSword && itemLocations.smithy.has("sword")
          ? `"Are you interested in buying that sword? It costs ${
              gameState.swordCost
            } gold${
              itemLocations.inventory.has("lute")
                ? " or I would trade it for your lute"
                : ""
            }. `
          : ""
      }`,
      ...(!gameState.ownSword &&
        itemLocations.smithy.has("sword") && {
          payDescription: `You hand the blacksmith ${gameState.swordCost} in exchange for the sword.`,
          payGameStateEffect: {
            ownSword: true,
            gold: gameState.gold - gameState.swordCost,
          },
          payItemLocationEffect: {
            item: "sword",
            oldLocation: "smithy",
            newLocation: "inventory",
          },
        }),
    },
    pasture: {
      sentient: itemLocations.pasture.has("horse"),
      connections: ["smithy"],
      dropPreposition: "at",
      description: `You are standing in a wide field. There is no road in sight. To the north, you hear sounds of the blacksmith shop. ${
        itemLocations.pasture.has("horse")
          ? 'A horse is grazing in the field. Its reins have come untied from the post. A sign reads: "Free horse (if you can catch it)."'
          : ""
      }`,
    },
    northGate: {
      connections: ["adolescent", "smithy", "road"],
      dropPreposition: "at",
      description: `You are standing at the north gate. To the north, you see a road leading up a mountain. The adolescent that you saw earlier stands at the courtyard${
        !gameState.playedForAdolescent ? ", crying" : ""
      }.`,
    },
    adolescent: {
      sentient: true,
      connections: ["northGate"],
      dropPreposition: "at",
      description: `todo`,
    },
    // todo roads
    road: {
      description: "todo",
      connections: ["northGate", "stream"],
      dropPreposition: "on",
    },
    stream: {
      description:
        "You come across a steam. It looks crossable by foot or by horse. On the north side, you see a bush full of berries. To the south, the road stretches back to the city.",
      connections: ["road", "clearing"],
      dropPreposition: "in",
    },
    clearing: {
      description: `You stand in a clearing. A bush full of berries catches your eye. To the south, a stream burbles. To the north, you see a rocky cliff with a cave. A man stands in the middle of the clearing. His long white beard, pointed hat, and staff mark him as a wizard. ${
        gameState.squirrelDead
          ? "A dead squirrel lies at the base of a tree. "
          : "A squirrel scampers around a tree."
      }`,
      connections: ["wizard", "squirrel", "stream", "cliff"],
      dropPreposition: "on",
    },
    squirrel: {
      sentient: true,
      description: gameState.squirrelDead
        ? "The squirrel lies dead on the ground."
        : "You approach the squirrel. It pauses, perhaps curious if you will feed it, before scampering up the tree.",
      connections: ["clearing"],
      dropPreposition: "by",
    },
    wizard: {
      sentient: true,
      connections: ["clearing"],
      dropPreposition: "by",
      description: `The wizard looks at you though bushy eyebrows. ${
        true ? "" : ""
      }`, // todo
    },
    cliff: {
      connections: itemLocations.inventory.has("horse")
        ? ["clearing"]
        : ["clearing", "caveEntrance"],
      dropPreposition: "on",
      description: itemLocations.inventory.has("horse")
        ? `The horse cannot make it up the rocky cliff. You must return to the clearing.`
        : `You scramble on the rocky cliff. Above you is the entrance to a cave. Below you is a clearing next to a stream.`,
    },
    caveEntrance: {
      connections: ["cliff", "lair", "puddle", "boulder", "dung"],
      dropPreposition: "in",
      description: `You stand in the entrance of a large cave. To the west, there is an entrance to a foul smelling room. To the east, there is an entrance to a room that glitters with gems and gold. ${
        !gameState.dragonAsleep
          ? "You hear coins clanking from the east room, as if a large beast is rolling in piles of gold."
          : ""
      }${
        !gameState.poopy && gameState.timeInCave === 1
          ? 'From the east room, a voice booms "WHO DO I SMELL?"'
          : ""
      }`,
      // onEnterGameStateEffect: { timeInCave: gameState.timeInCave + 1 },
    },
    defecatory: {
      connections: ["caveEntrance", "puddle", "boulder", "dung"],
      dropPreposition: "in",
      description:
        "You stand in a foul smelling room. On the south side, there is a puddle of clear water. On the west side, there is a large boulder. On the north side, there is a pile of dragon dung. The stench makes you gag.",
      onEnterGameStateEffect: { timeInCave: gameState.timeInCave + 1 },
    },
    puddle: {
      connections: ["caveEntrance", "boulder", "dung"],
      dropPreposition: "in",
      description: `You stand at a puddle of clear water. To the west, there is a large boulder. To the north, there is a pile of dragon dung. 
        ${dragonDescription()}`,
        onEnterGameStateEffect: { timeInCave: gameState.timeInCave + 1, ...(((gameState.timeInCave % 4 === 3) && (!gameState.poopy || playerLocation !== "boulder")) && {singeCount: gameState.singeCount + 1,reputation: gameState.reputation - 1}) },    },
    boulder: {
      connections: ["caveEntrance", "puddle", "dung"],
      dropPreposition: "in",
      description: `You walk behind the boulder. It seems large enough to hide your from sight. To the north, there is a pile of dragon dung. To the south, there is a pool of clear water.
      
      ${dragonDescription()}`,
      onEnterGameStateEffect: { timeInCave: gameState.timeInCave + 1, ...(((gameState.timeInCave % 4 === 3) && (!gameState.poopy || playerLocation !== "boulder")) && {singeCount: gameState.singeCount + 1,reputation: gameState.reputation - 1}) },    },
    dung: {
      connections: ["caveEntrance", "puddle", "boulder"],
      dropPreposition: "in",
      description: `Dung todo. 
      
      ${dragonDescription()}`,
      onEnterGameStateEffect: { timeInCave: gameState.timeInCave + 1, ...(((gameState.timeInCave % 4 === 3) && (!gameState.poopy || playerLocation !== "boulder")) && {singeCount: gameState.singeCount + 1,reputation: gameState.reputation - 1}) },    },
    lair: {
      //todo
      connections: ["caveEntrance"],
      dropPreposition: "in",
      description: `You stand in a room full of gold and gems. ${
        !gameState.dragonAsleep &&
        !gameState.dragonDead &&
        !gameState.dragonPoisoned
          ? "A dragon sits atop the pile of treasure. "
          : ""
      }${
        gameState.dragonAsleep && !gameState.dragonDead
          ? "The dragon lies in a deep slumber atop the pile of treasure. "
          : ""
      }${
        gameState.dragonDead
          ? "The dragon's body lies top the pile of treasure, its head severed. "
          : ""
      }${
        !gameState.dragonAsleep &&
        !gameState.dragonDead &&
        gameState.dragonPoisoned
          ? "The dragon looks half dead from the poison but still shoots flame as you approach it and its pile of treasure."
          : ""
      }`,
      
    },
  };

  function dragonDescription() {
    const timeInterval = gameState.timeInCave % 4;

    let text = "";
    let singe = false;
    let poisoned = false;

    if (
      timeInterval === 3 ||
      (gameState.poopy &&
        playerLocation === "boulder" &&
        itemLocations.puddle.has("berries"))
    ) {
      text += "The dragon prowls into the room.";
      // not poop and not hidden
      if (!gameState.poopy && playerLocation !== "boulder") {
        text += `"I KNEW I SMELT A HUMAN." The dragon singes you before you can fight or defend yourself. `;
        singe = true;
      } // poop and not hidden
      else if (gameState.poopy && playerLocation !== "boulder") {
        text += `"YOU DO NOT SMELL LIKE A HUMAN BUT YOU LOOK LIKE ONE. The dragon singes you before you can fight or defend yourself. " `;
        singe = true;
      } // not poop and hidden
      else if (!gameState.poopy && playerLocation === "boulder") {
        text += `"I SMELL A HUMAN SOMEWHERE NEARBY." The dragon peaks around the boulder and spots you. The dragon singes you before you can fight or defend yourself. `;
        singe = true;
      } // poop and hidden
      else if (gameState.poopy && playerLocation !== "boulder") {
        text +=
          "The dragon prowls through the cavern, unaware of your location.";

        // dragon drinks
        if (itemLocations.puddle.has("berries")) {
          ("The dragon drinks from the puddle. It starts foaming at the mouth. Enraged and in pain, it stumbles back to the lair.");
          poisoned = true;
        } else {
          ("The dragon drinks from the puddle, then returns to the lair.");
        }
      }
    } else if (timeInterval === 2) {
      text += "You hear the dragon just outside.";
    } else if (timeInterval === 1) {
      text +=
        "You hear coins clanking from the east room, as if a large beast is rising from a sea of treasure. ";
    }

    // setGameState({
    //   ...gameState,
    //   ...(singe && {singeCount: gameState.singeCount + 1,
    //     reputation: gameState.reputation - 1,}),
    //   ...(poisoned && {dragonPoisoned: true,}),
    // });

    return text;
  }

  // poison - can steal treasure but get singed. can put to sleep without singed. can't use sword without getting singed.
  // sleep - can steal treasure without singed. can use sword without getting singed.
  // dead - can steal treasure without singed and get glory for saving town

  // if not poop and not hidden:
  // if poop and not hidden: Singes.
  // if not poop and hidden:
  // if poop and hidden: The dragon takes a drink from the water.

  const allItems = {
    lute: {
      spawnLocation: "room",
      description: "a wooden lute",
      ...(playerLocation === "room" && {
        takeDescription: "The lute feels familiar.",
      }),
      useVerb: "Play",
      useDescription: "You play a beautiful melody.",
      ...(playerLocation === "adolescent" &&
        !gameState.playedForAdolescent && {
          useDescription: `You play a song for the crying adolescent. The music seems to cheer the youth up.`,
          useGameStateEffect: {
            reputation: gameState.reputation + 1,
            playedForAdolescent: true,
          },
        }),
      ...(playerLocation === "adolescent" &&
        gameState.playedForAdolescent && {
          useDescription: `They appreciate the music, but don't seem keen to listen all day.`,
        }),
      ...(!gameState.ownSword &&
        itemLocations.smithy.has("sword") && {
          giveDescription:
            "You give your lute to the blacksmith. In exchange, they give you the sword.",
          giveGameStateEffect: { ownSword: true },
          giveItemLocationEffect: {
            item: "sword",
            oldLocation: "smithy",
            newLocation: "inventory",
          },
        }),
    },
    clothes: {
      spawnLocation: "wardrobe",
      dropDescription: `You strip down and drop your clothes ${locations[playerLocation].dropPreposition} the ${playerLocation}.`,
      dropGameStateEffect: { naked: true },
      ...(playerLocation === ("fountain" || "stream" || "puddle") && {
        dropDescription: `You strip down and drop your clothes ${locations[playerLocation].dropPreposition} the ${playerLocation}. Your clothes look much cleaner now.`,
        dropGameStateEffect: { naked: true, poopy: false }, // todo lose reputation if at fountain (drinking water)?
      }),
      ...(playerLocation === "dung" && {
        dropDescription: `You strip down and drop your clothes ${locations[playerLocation].dropPreposition} the ${playerLocation}. Your clothes are now covered in dragon dung.`,
        dropGameStateEffect: { naked: true, poopy: true },
      }),
      ...(gameState.poopy
        ? { description: "a poopy set of clothes" }
        : { description: "a set of clothes" }),
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
      useDescription: "You bite eat the apple, feeling refreshed.",
      ...(itemLocations.pasture.has("horse") &&
        playerLocation === "pasture" && {
          dropDescription:
            "This horse seems very interested in food. The horse walks over to eat the apple that you dropped. While he is preoccupied, you tie the reins back to the post.",
          dropGameStateEffect: { horseTethered: true },
          dropLocation: "outOfPlay",
          giveDescription:
            "This horse seems very interested in food. The horse walks over to eat the apple that you offered. While he is preoccupied, you tie the reins back to the post.",
          giveGameStateEffect: { horseTethered: true },
          giveLocation: "outOfPlay",
        }),
      ...(playerLocation === "squirrel" &&
        !gameState.squirrelDead && {
          giveDescription:
            "The squirrel nibbles at the apple, pleased to have such a treat.",
          giveLocation: "outOfPlay",
        }),
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
            useDescription: `You tie the handkerchief around your nose and mouth. ${
              playerLocation === ("manor" || "nursery" || "nurseryWindow") &&
              gameState.fire &&
              gameState.masked
                ? "The damp handkerchief lets you breath more easily. "
                : ""
            }${
              playerLocation === ("manor" || "nursery" || "nurseryWindow") &&
              gameState.fire &&
              !gameState.masked
                ? "On its own, the handkerchief does little to block the smoke. "
                : ""
            }${
              playerLocation ===
              ("dung" || "defecatory" || "boulder" || "puddle")
                ? "Even with it, the stench reaches your nose. "
                : ""
            }}`,
            useGameStateEffect: { masked: true },
          }),
      ...(playerLocation === ("fountain" || "stream" || "puddle") && {
        dropGameStateEffect: { handkerchiefDamp: true },
      }),
      ...(playerLocation === "adolescent" && {
        giveDescription: `You offer the handkerchief that you saw the adolescent drop. "Th-thank you," they sob. She tells you that she was meant to be sacrificed to the dragon in exchange for another year of safety for the town. In retaliation, she set the mayor's house on fire, not realizing that the baby was trapped inside.`,
        giveGameStateEffect: { reputation: gameState.reputation + 1 },
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
      ...(gameState.dragonAsleep &&
        !gameState.dragonDead &&
        playerLocation === "lair" && {
          useDescription: "You cut off the head of the dragon.",
          useGameStateEffect: {
            dragonDead: true,
          },
        }),
      ...(gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead &&
        playerLocation === "lair" && {
          useDescription:
            "Despite the poison, the dragon is still able to singe you once you get near enough to cut off its head.",
          useGameStateEffect: {
            singeCount: gameState.singeCount + 1,
            reputation: gameState.reputation - 1,
          },
        }),
      ...(!gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead &&
        playerLocation === "lair" && {
          useDescription:
            "You try to cut off the dragon's head, but it singes you as soon as you get close enough.",
          useGameStateEffect: {
            singeCount: gameState.singeCount + 1,
            reputation: gameState.reputation - 1,
          },
        }),
    },
    horse: {
      description: gameState.horseDead ? "a dead horse" : "a voracious horse",
      ...(!gameState.horseTethered && {
        takeDescription:
          "You try to grab the horse's reins, but it evades you. It seems more interested in foraging for food than carrying you around.",
        takeLocation: playerLocation,
      }),
      ...(gameState.horseDead && {
        takeDescription: "This dead horse is too heavy to carry.",
        takeLocation: playerLocation,
      }),
      dropDescription:
        "You let go of the horse's reins. The horse trots away, probably in search of grass to munch.",
      dropGameStateEffect: { horseTethered: false, horseMounted: false },
      ...(gameState.horseMounted
        ? {
            useVerb: "Unmount",
            useDescription:
              "You unmount the horse, keeping hold of the horse's reins.",
            useGameStateEffect: { horseMounted: false },
            dropDescription:
              "You unmount the horse and let go of the horse's reins.",
          }
        : {
            useVerb: "Mount",
            useDescription: "You mount the horse. Much easier than walking!",
            useGameStateEffect: { horseMounted: true },
          }),
      ...(playerLocation === "clearing"
        ? {
            dropDescription:
              "You let go of the horse's reins. The horse starts to eat the berries. After a few mouthfuls, it foams at the mouth and falls over dead.",
            dropGameStateEffect: {
              horseTethered: false,
              horseMounted: false,
              horseDead: true,
            },
          }
        : ""),
    },
    berries: {
      description: "red berries",
      useVerb: "Eat",
      useDescription:
        "You pop the berries into your mouth. Immediately, your mouth starts to tingle, so you spit out the berries. You narrowly avoided death, but your face is splotchy ans swollen, and your lips are a nasty shade of purple.",
      useGameStateEffect: {
        poisoned: true,
        reputation: gameState.reputation - 1,
      },
      ...(playerLocation === "squirrel" &&
        !gameState.squirrelDead && {
          giveDescription:
            "The squirrel eats the berries that you offered. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear.",
          giveLocation: "clearing",
          giveGameStateEffect: { squirrelDead: true }, // todo didn't give way to give berries to horse. probably ok.
        }),
    },
    treasure: {
      ...(gameState.dragonDead && {
        takeDescription:
          "You scoop as much treasure as possible into your bag, avoiding the gore from the severed dragon head.",
        takeGameStateEffect: {
          gold: gameState.gold + gameState.treasureAmount,
        },
        takeLocation: "outOfPlay",
      }),
      ...(gameState.dragonAsleep &&
        !gameState.dragonDead && {
          takeDescription:
            "Giving a wide berth to the snoring dragon, you scoop as much treasure as possible into your bag.",
          takeGameStateEffect: {
            gold: gameState.gold + gameState.treasureAmount,
          },
          takeLocation: "outOfPlay",
        }),
      ...(gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead && {
          takeDescription:
            "With the dragon slower from the poison, you can now reach the treasure. You scoop as much treasure as possible into your bag before the dragon singes you.",
          takeGameStateEffect: {
            gold: gameState.gold + gameState.treasureAmount / 2,
            singeCount: gameState.singeCount + 1,
            reputation: gameState.reputation - 1,
          },
          takeLocation: "outOfPlay",
        }),
      ...(!gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead && {
          takeDescription:
            "You try to steal the treasure, but the dragon singes you before you can get close.",
          takeGameStateEffect: {
            singeCount: gameState.singeCount + 1,
            reputation: gameState.reputation - 1,
          },
          takeLocation: "lair",
        }),
    },
    score: {
      description: "a musical score",
      useVerb: "Play",
      useDescription: itemLocations.inventory.has("lute")
        ? "You play a lulling melody."
        : "You would like to play this song, but you have no instrument.",
      ...(gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead &&
        playerLocation === "lair" &&
        itemLocations.inventory.has("lute") && {
          useDescription:
            "You play a lulling melody. The dragon closes its eyes and begins to snore.",
          useGameStateEffect: {
            dragonAsleep: true,
          },
        }),
      ...(!gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead &&
        playerLocation === "lair" &&
        itemLocations.inventory.has("lute") && {
          useDescription:
            "Before you can play the first few notes, the dragon lets out a burst of flame, singing you and nearly burning your lute.",
          useGameStateEffect: {
            singeCount: gameState.singeCount + 1,
            reputation: gameState.reputation - 1,
          },
        }),
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
      : `You drop the ${item} ${locations[playerLocation].dropPreposition} the ${playerLocation}`;

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

  function handlePay() {
    if (
      locations[playerLocation].payDescription ||
      locations[playerLocation].payGameStateEffect ||
      locations[playerLocation].payItemLocationEffect
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
    // Get the "pay" description for the item -- this will be the consequence text
    const description = locations[playerLocation].payDescription
      ? locations[playerLocation].payDescription
      : `You pay the ${playerLocation}.`;

    if (locations[playerLocation].payGameStateEffect) {
      setGameState({
        ...gameState,
        ...locations[playerLocation].payGameStateEffect,
      });
    }

    if (locations[playerLocation].payItemLocationEffect) {
      moveItem(locations[playerLocation].payItemLocationEffect);
    }

    // set the consequence text to the give description text
    setConsequenceText(description);

    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function handleGive(item) {
    // If "give" is not handled, you can't give
    if (
      allItems[item].giveDescription ||
      allItems[item].giveGameStateEffect ||
      allItems[item].giveLocation ||
      allItems[item].giveItemLocationEffect
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
    const description = allItems[item].giveDescription
      ? allItems[item].giveDescription
      : `You give the ${item} to the ${playerLocation}.`;

    // Get the "give" end location for the item -- will usually be outOfPlay
    const endItemLocation = allItems[item].giveLocation
      ? allItems[item].giveLocation
      : "outOfPlay";

    console.log(`give to ${endItemLocation}`);

    if (allItems[item].giveGameStateEffect) {
      setGameState({ ...gameState, ...allItems[item].giveGameStateEffect });
    }

    // Set the item location from the inventory to the new location
    moveItem({
      item: item,
      oldLocation: "inventory",
      newLocation: endItemLocation,
    });

    if (allItems[item].giveItemLocationEffect) {
      moveItem(allItems[item].giveItemLocationEffect);
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
          <div key={item}>{allItems[item].description}</div>
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
          <button
            disabled={!locations[playerLocation].sentient}
            onClick={(e) => handleGive(item)}
            className="item"
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
          {locations[connection].displayName
            ? locations[connection].displayName
            : connection}
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
        <div className="inventoryItem" key="gold">
          <div key="gold">{gameState.gold + " gold"}</div>
          <button
            disabled={!locations[playerLocation].sentient}
            onClick={(e) => handlePay()}
            className="item"
            key={"gold-give"}
          >
            Pay
          </button>
        </div>
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
