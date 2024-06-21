const {
  applyDamage,
  healCharacter,
  applyTempHitPoints,
} = require("./characterService");
const assert = require("assert");

describe("applyDamage", () => {
  let collection;

  beforeEach(() => {
    collection = {
      findOne: async () => {},
      updateOne: async () => {},
    };
  });

  it("should apply damage to existing character", async () => {
    const name = "character1";
    const type = "randomType";
    const currentHp = 100;
    const damage = 60;
    const expectedDamage = currentHp - damage;

    collection.findOne = async () => ({
      _id: "12345",
      name: name,
      hitPoints: currentHp,
      defense: [],
    });

    const result = await applyDamage(collection, name, damage, type);
    assert.strictEqual(
      result,
      `${name}'s HP = ${expectedDamage} and temporary HP = undefined.`
    );
  });

  it("should apply half-damage when defense matches resistance defense to existing character", async () => {
    const name = "character1";
    const type = "type1";
    const currentHp = 100;
    const damage = 60;
    const expectedDamage = currentHp - damage / 2;

    collection.findOne = async () => ({
      _id: "12345",
      name: name,
      hitPoints: currentHp,
      defenses: [{ type: type, defense: "resistance" }],
    });

    const result = await applyDamage(collection, name, damage, type);

    assert.strictEqual(
      result,
      `${name}'s HP = ${expectedDamage} and temporary HP = undefined.`
    );
  });

  it("should apply no damage when defense matches immunity defense to existing character", async () => {
    const name = "character1";
    const type = "type1";
    const currentHp = 100;
    const damage = 60;
    const expectedDamage = currentHp;

    collection.findOne = async () => ({
      _id: "12345",
      name: name,
      hitPoints: currentHp,
      defenses: [{ type: type, defense: "immunity" }],
    });

    const result = await applyDamage(collection, name, damage, type);

    assert.strictEqual(
      result,
      `${name}'s HP = ${expectedDamage} and temporary HP = undefined.`
    );
  });

  it("should apply damage to temp HP prior to primary HP to existing character with temp HP", async () => {
    const name = "character1";
    const type = "type1";
    const currentHp = 100;
    const tempHitPoints = 100;
    const damage = 150;
    const expectedHp = damage - tempHitPoints;
    const expectedTempHp = 0;

    collection.findOne = async () => ({
      _id: "12345",
      name: name,
      hitPoints: currentHp,
      tempHitPoints: tempHitPoints,
      defenses: [],
    });

    const result = await applyDamage(collection, name, damage, type);

    assert.strictEqual(
      result,
      `${name}'s HP = ${expectedHp} and temporary HP = ${expectedTempHp}.`
    );
  });

  it("should apply damage to temp HP prior to primary HP to existing character with temp HP", async () => {
    const name = "character1";
    const type = "type1";
    const currentHp = 100;
    const tempHitPoints = 100;
    const damage = 150;
    const expectedHp = damage - tempHitPoints;
    const expectedTempHp = 0;

    collection.findOne = async () => ({
      _id: "12345",
      name: name,
      hitPoints: currentHp,
      tempHitPoints: tempHitPoints,
      defenses: [],
    });

    const result = await applyDamage(collection, name, damage, type);

    assert.strictEqual(
      result,
      `${name}'s HP = ${expectedHp} and temporary HP = ${expectedTempHp}.`
    );
  });

  it("should not go below 0 if damage is past primary HP to existing character", async () => {
    const name = "character1";
    const type = "randomType";
    const currentHp = 100;
    const damage = 101;
    const expectedDamage = 0;

    collection.findOne = async () => ({
      _id: "12345",
      name: name,
      hitPoints: currentHp,
      defense: [],
    });

    const result = await applyDamage(collection, name, damage, type);
    assert.strictEqual(
      result,
      `${name}'s HP = ${expectedDamage} and temporary HP = undefined.`
    );
  });

  it("should throw an error if character doesn't exist", async () => {
    collection.findOne = async () => null;

    await assert.rejects(
      applyDamage(collection, "NonExistentCharacter", 10, "randomAttackType"),
      (err) => {
        assert.strictEqual(
          err.message,
          "Character NonExistentCharacter does not exist."
        );
        return true;
      }
    );
  });
});

describe("healCharacter", () => {
  let collection;

  beforeEach(() => {
    collection = {
      findOne: async () => {},
      updateOne: async () => {},
    };
  });

  it("should heal an existing character", async () => {
    const name = "character1";
    const currentHp = 100;
    const healAmount = 20;
    const expectedResult = currentHp + healAmount;

    collection.findOne = async () => ({
      _id: "12345",
      name: name,
      hitPoints: currentHp,
    });

    const result = await healCharacter(collection, name, healAmount);
    assert.strictEqual(result, `${name}'s HP = ${expectedResult}.`);
  });

  it("should throw an error if character doesn't exist", async () => {
    collection.findOne = async () => null;

    await assert.rejects(
      healCharacter(collection, "NonExistentCharacter", 10),
      (err) => {
        assert.strictEqual(
          err.message,
          "Character NonExistentCharacter does not exist."
        );
        return true;
      }
    );
  });
});

describe("applyTempHitPoints", () => {
  let collection;

  beforeEach(() => {
    collection = {
      findOne: async () => {},
      updateOne: async () => {},
    };
  });

  it("should apply temp HP to existing character with no temp HP", async () => {
    const name = "character1";
    const tempHitPoints = 10;

    collection.findOne = async () => ({
      _id: "12345",
      name: name,
    });

    const result = await applyTempHitPoints(collection, name, tempHitPoints);
    assert.strictEqual(result, `${name}'s temporary HP = ${tempHitPoints}.`);
  });

  it("should not apply new temp HP to existing character with a higher temp HP", async () => {
    const name = "character1";
    const tempHitPoints = 10;

    collection.findOne = async () => ({
      _id: "12345",
      name: name,
      tempHitPoints: 1000,
    });

    const result = await applyTempHitPoints(collection, name, tempHitPoints);
    assert.strictEqual(result, `${name}'s temporary HP = 1000.`);
  });

  it("should throw an error if character doesn't exist", async () => {
    collection.findOne = async () => null;

    await assert.rejects(
      applyTempHitPoints(collection, "NonExistentCharacter", 10),
      (err) => {
        assert.strictEqual(
          err.message,
          "Character NonExistentCharacter does not exist."
        );
        return true;
      }
    );
  });
});
