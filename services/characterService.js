const applyDamage = async (collection, name, damage, type) => {
  const character = await collection.findOne({ name: name });

  if (!character) {
    throw new Error(`Character ${name} does not exist.`);
  }

  // re-calculate damage base on attack type
  if (character.defenses && character.defenses.length > 0) {
    for (const defenseObj of character.defenses) {
      if (defenseObj.type == type) {
        switch (defenseObj.defense) {
          case "immunity":
            damage = 0;
            break;
          case "resistance":
            damage /= 2;
            break;
        }
        break;
      }
    }
  }

  // apply damage to temp-HP/primary-HP
  if (character.tempHitPoints && character.tempHitPoints > 0) {
    if (character.tempHitPoints >= damage) {
      character.tempHitPoints -= damage;
    } else {
      character.hitPoints -= damage - character.tempHitPoints;
      character.tempHitPoints = 0;
    }
  } else {
    character.hitPoints -= damage;
  }

  // ensure HP does not go below 0
  if (character.hitPoints < 0) {
    character.hitPoints = 0;
  }

  let updateQry = {
    $set: {
      hitPoints: character.hitPoints,
      tempHitPoints:
        character.tempHitPoints >= 0 ? character.tempHitPoints : undefined,
    },
  };

  await collection.updateOne({ _id: character._id }, updateQry);
  // modify message based on damage type?
  return `${name}'s HP = ${character.hitPoints} and temporary HP = ${character.tempHitPoints}.`;
};

const healCharacter = async (collection, name, health) => {
  const character = await collection.findOne({ name: name });

  if (!character) {
    throw new Error(`Character ${name} does not exist.`);
  }

  // Assuming there's no maxHealth property to exceed
  character.hitPoints += health;

  await collection.updateOne(
    { _id: character._id },
    { $set: { hitPoints: character.hitPoints } }
  );

  return `${name}'s HP = ${character.hitPoints}.`;
};

const applyTempHitPoints = async (collection, name, tempHitPoints) => {
  const character = await collection.findOne({ name: name });

  if (!character) {
    throw new Error(`Character ${name} does not exist.`);
  }

  character.tempHitPoints = character.tempHitPoints
    ? Math.max(character.tempHitPoints, tempHitPoints)
    : tempHitPoints;

  await collection.updateOne(
    { _id: character._id },
    { $set: { tempHitPoints: character.tempHitPoints } }
  );

  return `${name}'s temporary HP = ${character.tempHitPoints}.`;
};

module.exports = { applyDamage, healCharacter, applyTempHitPoints };
