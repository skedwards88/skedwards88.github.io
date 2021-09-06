class Item {
  constructor({
    id,
    displayName = id[0].toUpperCase() + id.slice(1),
    spawnLocation,
    getDescription = function () {
      return displayName;
    },

    getUseVerb = function () {
      return "Use";
    },
    getCustomUseDescription,
    getCustomUseGameEffect,

    getCustomDropDescription,
    getCustomDropLocation,
    getCustomDropGameEffect,

    getCustomTakeDescription,
    getCustomTakeLocation,
    getCustomTakeGameEffect,

    getCustomGiveDescription,
    getCustomGiveLocation,
    getCustomGiveGameEffect,
    getCustomGiveItemLocationEffect,
  }) {
    this.id = id;
    this.displayName = displayName;
    this.spawnLocation = spawnLocation;
    this.getDescription = getDescription;

    this.getUseVerb = getUseVerb;
    this.getCustomUseDescription = getCustomUseDescription;
    this.getCustomUseGameEffect = getCustomUseGameEffect;

    this.getCustomDropDescription = getCustomDropDescription;
    this.getCustomDropLocation = getCustomDropLocation;
    this.getCustomDropGameEffect = getCustomDropGameEffect;

    this.getCustomTakeDescription = getCustomTakeDescription;
    this.getCustomTakeLocation = getCustomTakeLocation;
    this.getCustomTakeGameEffect = getCustomTakeGameEffect;

    this.getCustomGiveDescription = getCustomGiveDescription;
    this.getCustomGiveLocation = getCustomGiveLocation;
    this.getCustomGiveGameEffect = getCustomGiveGameEffect;
    this.getCustomGiveItemLocationEffect = getCustomGiveItemLocationEffect;
  }
}

const blank = new Item({
  id: "blank",
  spawnLocation: "",
  getDescription: function (props) {},

  getUseVerb: function (props) {},
  getCustomUseDescription: function (props) {},
  getCustomUseGameEffect: function (props) {},

  getCustomDropDescription: function (props) {},
  getCustomDropLocation: function (props) {},
  getCustomDropGameEffect: function (props) {},

  getCustomTakeDescription: function (props) {},
  getCustomTakeLocation: function (props) {},
  getCustomTakeGameEffect: function (props) {},

  getCustomGiveDescription: function (props) {},
  getCustomGiveLocation: function (props) {},
  getCustomGiveGameEffect: function (props) {},
  getCustomGiveItemLocationEffect: function (props) {},
});

const lute = new Item({
  id: "lute",
  spawnLocation: "room",
  getDescription: function () {
    return "wooden lute";
  },

  getUseVerb: function () {
    return "Play";
  },
  getCustomUseDescription: function (props) {
    if (
      props.playerLocation === "adolescent" &&
      !props.gameState.playedForAdolescent
    ) {
      return `You play a song for the crying adolescent. The music seems to cheer the youth up. `;
    } else if (
      props.playerLocation === "adolescent" &&
      props.gameState.playedForAdolescent
    ) {
      return `They appreciate the music, but don't seem keen to listen all day. `;
    } else {
      return "You play a beautiful melody. ";
    }
  },
  getCustomUseGameEffect: function (props) {
    if (
      props.playerLocation === "adolescent" &&
      !props.gameState.playedForAdolescent
    ) {
      return {
        reputation: props.gameState.reputation + 1,
        playedForAdolescent: true,
      };
    }
  },

  getCustomTakeDescription: function (props) {
    if (props.playerLocation === "room") {
      return "The lute feels familiar. ";
    }
  },
  getCustomTakeLocation: function (props) {},
  getCustomTakeGameEffect: function (props) {},

  getCustomGiveDescription: function (props) {
    if (
      !props.gameState.ownSword &&
      props.itemLocations.smithy.has("sword") &&
      props.playerLocation === "blacksmith"
    ) {
      return "You give your lute to the blacksmith. In exchange, they give you the sword. ";
    }
  },
  getCustomGiveLocation: function (props) {},
  getCustomGiveGameEffect: function (props) {
    if (
      !props.gameState.ownSword &&
      props.itemLocations.smithy.has("sword") &&
      props.playerLocation === "blacksmith"
    ) {
      return { ownSword: true };
    }
  },
  getCustomGiveItemLocationEffect: function (props) {
    if (
      !props.gameState.ownSword &&
      props.itemLocations.smithy.has("sword") &&
      props.playerLocation === "blacksmith"
    ) {
      return {
        item: "sword",
        oldLocation: "smithy",
        newLocation: "inventory",
      };
    }
  },
});

const clothes = new Item({
  id: "clothes",
  spawnLocation: "wardrobe",
  getDescription: function (props) {
    return props.gameState.poopy ? "poopy set of clothes" : "set of clothes";
  },

  getUseVerb: function (props) {
    return props.gameState.naked ? "Wear" : "Remove";
  },
  getCustomUseDescription: function (props) {
    return props.gameState.naked
      ? "You put on the clothes. "
      : "You strip down. ";
  },
  getCustomUseGameEffect: function (props) {
    return props.gameState.naked ? { naked: false } : { naked: true };
  },

  getCustomDropDescription: function (props) {
    let text = "";

    props.gameState.naked
      ? (text += `You drop your clothes ${props.dropPreposition} the ${props.playerLocation}. `)
      : (text += `You strip down and drop your clothes ${props.dropPreposition} the ${props.playerLocation}. `);

    if (["fountain", "stream", "puddle"].includes(props.playerLocation)) {
      text += "Your clothes look much cleaner now. ";
    }

    return text;
  },
  getCustomDropGameEffect: function (props) {
    if (["fountain", "stream", "puddle"].includes(props.playerLocation)) {
      return { naked: true, poopy: false }; // todo lose reputation if at fountain (drinking water)?
    } else if (props.playerLocation === "dung") {
      return { naked: true, poopy: true };
    } else {
      return { naked: true };
    }
  },
});

const apple = new Item({
  id: "apple",
  spawnLocation: "inn",
  getDescription: function (props) {
    return "fresh apple";
  },
  // todo when you eat the apple, it remains in inventory; it should not. also, if apple is not in inventory, it should be in inn so you can get another one

  getUseVerb: function (props) {
    return "Eat";
  },
  getCustomUseDescription: function (props) {
    return "You eat the apple, feeling refreshed. ";
  },
  getCustomDropDescription: function (props) {
    // todo should you be able to drop/give to squirrel also?
    if (
      props.itemLocations.pasture.has("horse") &&
      props.playerLocation === "pasture"
    ) {
      return "This horse seems very interested in food. The horse walks over to eat the apple that you dropped. While he is preoccupied, you tie the reins back to the post. ";
    }
  },
  getCustomDropLocation: function (props) {
    if (
      props.itemLocations.pasture.has("horse") &&
      props.playerLocation === "pasture"
    ) {
      return "outOfPlay";
    }
  },
  getCustomDropGameEffect: function (props) {
    if (
      props.itemLocations.pasture.has("horse") &&
      props.playerLocation === "pasture"
    ) {
      return { horseTethered: true };
    }
  },
  // todo should you also be able to give to squirrel?
  getCustomGiveDescription: function (props) {
    if (
      props.itemLocations.pasture.has("horse") &&
      props.playerLocation === "pasture"
    ) {
      return "This horse seems very interested in food. The horse walks over to eat the apple that you offered. While he is preoccupied, you tie the reins back to the post. ";
    }
  },
  getCustomGiveLocation: function (props) {
    if (
      props.itemLocations.pasture.has("horse") &&
      props.playerLocation === "pasture"
    ) {
      return "outOfPlay";
    }
  },
  getCustomGiveGameEffect: function (props) {
    if (
      props.itemLocations.pasture.has("horse") &&
      props.playerLocation === "pasture"
    ) {
      return { horseTethered: true };
    }
  },
  getCustomGiveItemLocationEffect: function (props) {}, //todo could use this to make horse go it inventory instead of being tied up. would also want to add for drop.
});

const handkerchief = new Item({
  // todo when you drop the handkerchief but are wearing it, you should also stop wearingit

  id: "handkerchief",
  spawnLocation: "courtyard",
  getDescription: function (props) {
    return props.gameState.handkerchiefDamp
      ? "damp handkerchief"
      : "handkerchief";
  },
  getUseVerb: function (props) {
    return props.gameState.masked ? "Wear" : "Remove";
  },
  getCustomUseDescription: function (props) {
    let text = "";
    props.gameState.masked
      ? (text += "You tie the handkerchief around your nose and mouth. ")
      : (text += "You remove the handkerchief from your nose and mouth. ");

    if (
      ["manor", "nursery", "nurseryWindow"].includes(props.playerLocation) &&
      props.gameState.fire &&
      props.gameState.handkerchiefDamp
    ) {
      text += "The damp handkerchief lets you breath more easily. ";
    }

    if (
      ["manor", "nursery", "nurseryWindow"].includes(props.playerLocation) &&
      props.gameState.fire &&
      !props.gameState.handkerchiefDamp
    ) {
      text += "On its own, the handkerchief does little to block the smoke. ";
    }

    if (
      ["dung", "defecatory", "boulder", "puddle"].includes(props.playerLocation)
    ) {
      text += "Even with it, the stench reaches your nose. ";
    }

    return text;
  },
  getCustomUseGameEffect: function (props) {
    return props.gameState.masked ? { masked: false } : { masked: true };
  },
  getCustomDropDescription: function (props) {
    return `You remove the handkerchief from your nose and mouth and drop it ${props.dropPreposition} the ${props.playerLocation}. `;
  },
  getCustomDropGameEffect: function (props) {
    if (["fountain", "stream", "puddle"].includes(props.playerLocation)) {
      return { handkerchiefDamp: true, masked: false };
    } else {
      return { masked: false };
    }
  },
  getCustomGiveDescription: function (props) {
    // todo gender is inconsistent
    if (props.playerLocation === "adolescent") {
      return `You offer the handkerchief that you saw the adolescent drop. "Th-thank you," they sob. She tells you that she was meant to be sacrificed to the dragon in exchange for another year of safety for the town. In retaliation, she set the mayor's house on fire, not realizing that the baby was trapped inside. `;
    }
  },
  getCustomGiveLocation: function (props) {
    if (props.playerLocation === "adolescent") {
      return "outOfPlay";
    }
  },
  getCustomGiveGameEffect: function (props) {
    if (props.playerLocation === "adolescent") {
      return { reputation: props.gameState.reputation + 1 };
    }
  },
});

const baby = new Item({
  id: "baby",
  spawnLocation: "nursery",
  getDescription: function () {
    return "crying baby";
  },
  getUseVerb: function () {
    return "Use";
  },
  getCustomUseDescription: function () {
    return "It's unclear what use this baby has. ";
  },
  getCustomDropDescription: function (props) {
    if (props.playerLocation === "nursery") {
      return "You place the baby back in the crib. ";
    } else if (props.playerLocation === "nurseryWindow") {
      return "You drop the baby out of the open window. The crowd below catches the baby. ";
    } else {
      return "You drop the crying baby. It cries even louder. ";
    }
  },
  getCustomDropLocation: function (props) {
    if (props.playerLocation === "nurseryWindow") {
      return "outOfPlay";
    }
  },
  getCustomDropGameEffect: function (props) {
    if (!props.playerLocation === "nurseryWindow") {
      return { savedBaby: false };
    }
  },

  getCustomTakeDescription: function (props) {
    if (props.playerLocation === "nursery") {
      return "You pick up the baby from the crib. The baby coughs as you move it away from the open window. ";
    }
  },
  getCustomTakeGameEffect: function (props) {
    return { savedBaby: true };
  },
});

const sword = new Item({
  id: "sword",
  spawnLocation: "smithy",
  getUseVerb: function () {
    return "Attack";
  },
  getCustomUseDescription: function (props) {
    if (
      props.gameState.dragonAsleep &&
      !props.gameState.dragonDead &&
      props.playerLocation === "lair"
    ) {
      return "You cut off the head of the dragon. ";
    } else if (
      props.gameState.dragonPoisoned &&
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead &&
      props.playerLocation === "lair"
    ) {
      return "Despite the poison, the dragon is still able to singe you once you get near enough to cut off its head. ";
    } else if (
      !props.gameState.dragonPoisoned &&
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead &&
      props.playerLocation === "lair"
    ) {
      return "You try to cut off the dragon's head, but it singes you as soon as you get close enough. ";
    } else {
      return "You slash the sword through the air, looking a bit foolish. ";
    }
  },
  getCustomUseGameEffect: function (props) {
    if (
      props.gameState.dragonAsleep &&
      !props.gameState.dragonDead &&
      props.playerLocation === "lair"
    ) {
      return {
        dragonDead: true,
      };
    } else if (
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead &&
      props.playerLocation === "lair"
    ) {
      return {
        singeCount: props.gameState.singeCount + 1,
        reputation: props.gameState.reputation - 1,
      };
    }
  },
  getCustomTakeDescription: function (props) {
    if (props.playerLocation === "smithy" && !props.gameState.ownSword) {
      return 'You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The blacksmith shop grabs the sword from you and returns it to the table. ';
    }
  },
  getCustomTakeLocation: function (props) {
    if (props.playerLocation === "smithy" && !props.gameState.ownSword) {
      return "smithy";
    }
  },
  getCustomTakeGameEffect: function (props) {
    if (props.playerLocation === "smithy" && !props.gameState.ownSword) {
      return {
        reputation: props.gameState.reputation - 1,
        swordCost: props.gameState.swordCost + 10,
      }; // todo this means sword cost can exceed amount of gold that you have...set max?
    }
  },

  getCustomGiveDescription: function (props) {},
  getCustomGiveLocation: function (props) {},
  getCustomGiveGameEffect: function (props) {},
  getCustomGiveItemLocationEffect: function (props) {},
});

const horse = new Item({
  id: "horse",
  spawnLocation: "pasture",
  getDescription: function (props) {
    return props.gameState.horseDead ? "dead horse" : "voracious horse";
  },

  getUseVerb: function (props) {
    return props.gameState.horseMounted ? "Unmount" : "Mount";
  },
  getCustomUseDescription: function (props) {
    return props.gameState.horseMounted
      ? "You unmount the horse, keeping hold of the horse's reins. "
      : "You mount the horse. Much easier than walking!"; // todo should you be allowed to mount inside a building?
  },
  getCustomUseGameEffect: function (props) {
    return props.gameState.horseMounted
      ? { horseMounted: false }
      : { horseMounted: true };
  },
  getCustomDropDescription: function (props) {
    let text = "";

    if (props.gameState.horseMounted) {
      text += "You unmount the horse and let go of the horse's reins. ";
    } else {
      text += "You drop the horse's reins. ";
    }

    if (props.playerLocation === "clearing") {
      text +=
        "The horse starts to eat the berries. After a few mouthfuls, it foams at the mouth and falls over dead. ";
    } else {
      text +=
        "You let go of the horse's reins. The horse trots away, probably in search of grass to munch. ";
    }

    return text;
  },
  getCustomDropGameEffect: function (props) {
    if (props.playerLocation === "clearing") {
      return {
        horseTethered: false,
        horseMounted: false,
        horseDead: true,
      };
    } else {
      return { horseTethered: false, horseMounted: false };
    }
  },

  getCustomTakeDescription: function (props) {
    if (props.gameState.horseDead) {
      return "This dead horse is too heavy to carry. ";
    }

    if (!props.gameState.horseTethered) {
      return "You try to grab the horse's reins, but it evades you. It seems more interested in foraging for food than carrying you around. ";
    }
  },
  getCustomTakeLocation: function (props) {
    if (props.gameState.horseDead) {
      return props.playerLocation;
    }

    if (!props.gameState.horseTethered) {
      return props.playerLocation;
    }
  },
  getCustomGiveDescription: function (props) {},
  getCustomGiveLocation: function (props) {},
  getCustomGiveGameEffect: function (props) {},
  getCustomGiveItemLocationEffect: function (props) {},
});

const berries = new Item({
  id: "berries",
  spawnLocation: "clearing",
  getDescription: function () {
    return "red berries";
  },

  getUseVerb: function () {
    return "Eat";
  },
  getCustomUseDescription: function () {
    return "You pop the berries into your mouth. Immediately, your mouth starts to tingle, so you spit out the berries. You narrowly avoided death, but your face is splotchy and swollen, and your lips are a nasty shade of purple. ";
  }, // todo where do the berries go when you eat them?
  getCustomUseGameEffect: function (props) {
    return {
      poisoned: true,
      reputation: props.gameState.reputation - 1,
    };
  },
  getCustomDropDescription: function (props) {
    if (props.playerLocation === "squirrel" && !props.gameState.squirrelDead) {
      return "The squirrel eats the berries that you dropped. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear. ";
    }
  },
  getCustomDropLocation: function (props) {
    if (props.playerLocation === "squirrel" && !props.gameState.squirrelDead) {
      return "clearing";
    }
  },
  getCustomDropGameEffect: function (props) {
    if (props.playerLocation === "squirrel" && !props.gameState.squirrelDead) {
      return { squirrelDead: true };
    }
  },
  getCustomGiveDescription: function (props) {
    if (props.playerLocation === "squirrel" && !props.gameState.squirrelDead) {
      return "The squirrel eats the berries that you offered. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear. ";
    }
  },
  getCustomGiveLocation: function (props) {
    if (props.playerLocation === "squirrel" && !props.gameState.squirrelDead) {
      return "clearing";
    }
  },
  getCustomGiveGameEffect: function (props) {
    if (props.playerLocation === "squirrel" && !props.gameState.squirrelDead) {
      return { squirrelDead: true };
    }
  },
});

const treasure = new Item({
  id: "treasure",
  spawnLocation: "lair",

  getCustomTakeDescription: function (props) {
    if (props.gameState.dragonDead) {
      return "You scoop as much treasure as possible into your bag, avoiding the gore from the severed dragon head. ";
    }

    if (props.gameState.dragonAsleep && !props.gameState.dragonDead) {
      return "Giving a wide berth to the snoring dragon, you scoop as much treasure as possible into your bag. ";
    }

    if (
      props.gameState.dragonPoisoned &&
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead
    ) {
      return "With the dragon slower from the poison, you can now reach the treasure. You scoop as much treasure as possible into your bag before the dragon singes you. ";
    }

    if (
      !props.gameState.dragonPoisoned &&
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead
    ) {
      return "You try to steal the treasure, but the dragon singes you before you can get close. ";
    }
  },
  getCustomTakeLocation: function (props) {
    if (props.gameState.dragonDead) {
      return "outOfPlay";
    }

    if (props.gameState.dragonAsleep && !props.gameState.dragonDead) {
      return "outOfPlay";
    }

    if (
      props.gameState.dragonPoisoned &&
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead
    ) {
      return "outOfPlay";
    }

    if (
      !props.gameState.dragonPoisoned &&
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead
    ) {
      return "lair";
    }
  },
  getCustomTakeGameEffect: function (props) {
    if (props.gameState.dragonDead) {
      return {
        gold: props.gameState.gold + props.gameState.treasureAmount,
      };
    }

    if (props.gameState.dragonAsleep && !props.gameState.dragonDead) {
      return {
        gold: props.gameState.gold + props.gameState.treasureAmount,
      };
    }

    if (
      props.gameState.dragonPoisoned &&
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead
    ) {
      return {
        gold: props.gameState.gold + props.gameState.treasureAmount / 2,
        singeCount: props.gameState.singeCount + 1,
        reputation: props.gameState.reputation - 1,
      };
    }

    if (
      !props.gameState.dragonPoisoned &&
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead
    ) {
      return {
        singeCount: props.gameState.singeCount + 1,
        reputation: props.gameState.reputation - 1,
      };
    }
  },
});

const score = new Item({
  id: "score",
  spawnLocation: "wizard",
  getDescription: function (props) {
    return "musical score";
  },
  getUseVerb: function () {
    return "Play";
  },
  getCustomUseDescription: function (props) {
    if (!props.itemLocations.inventory.has("lute")) {
      return "You would like to play this song, but you have no instrument. ";
    }

    if (
      props.gameState.dragonPoisoned &&
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead &&
      props.playerLocation === "lair" &&
      props.itemLocations.inventory.has("lute")
    ) {
      return "You play a lulling melody. The dragon closes its eyes and begins to snore. ";
    }

    if (
      !props.gameState.dragonPoisoned &&
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead &&
      props.playerLocation === "lair" &&
      props.itemLocations.inventory.has("lute")
    ) {
      return "Before you can play the first few notes, the dragon lets out a burst of flame, singing you and nearly burning your lute. ";
    }

    return "You play a lulling melody. ";
  },
  getCustomUseGameEffect: function (props) {
    if (
      props.gameState.dragonPoisoned &&
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead &&
      props.playerLocation === "lair" &&
      props.itemLocations.inventory.has("lute")
    ) {
      return {
        dragonAsleep: true,
      };
    }

    if (
      !props.gameState.dragonPoisoned &&
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead &&
      props.playerLocation === "lair" &&
      props.itemLocations.inventory.has("lute")
    ) {
      return {
        singeCount: props.gameState.singeCount + 1,
        reputation: props.gameState.reputation - 1,
      };
    }
  },

  getCustomTakeDescription: function (props) {},
  getCustomTakeLocation: function (props) {},
  getCustomTakeGameEffect: function (props) {},

  getCustomGiveDescription: function (props) {},
  getCustomGiveLocation: function (props) {},
  getCustomGiveGameEffect: function (props) {},
  getCustomGiveItemLocationEffect: function (props) {},
});

// todo would it be better to have all drop, etc as one function?

export const allItems = {
  lute: lute,
  clothes: clothes,
  apple: apple,
  handkerchief: handkerchief,
  baby: baby,
  sword: sword,
  horse: horse,
  berries: berries,
  treasure: treasure,
  score: score,
};
export default {
  allItems,
};
