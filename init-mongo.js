// TODO: store into it's own docker folder
// TODO: add npm script to run the docker commands
// TODO: move the "dnd" to a constant file
db = db.getSiblingDB("dnd");

// move the json into a data.json
db.characters.insertOne({
  name: "Briv",
  level: 5,
  hitPoints: 25,
  classes: [{ name: "fighter", hitDiceValue: 10, classLevel: 5 }],
  stats: {
    strength: 15,
    dexterity: 12,
    constitution: 14,
    intelligence: 13,
    wisdom: 10,
    charisma: 8,
  },
  items: [
    {
      name: "Ioun Stone of Fortitude",
      modifier: {
        affectedObject: "stats",
        affectedValue: "constitution",
        value: 2,
      },
    },
  ],
  defenses: [
    { type: "fire", defense: "immunity" },
    { type: "slashing", defense: "resistance" },
  ],
});
