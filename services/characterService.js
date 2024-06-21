const applyDamage = async (collection, name, damage, type) => {
  const character = await collection.findOne({ name: name });

  if (!character) {
    throw new Error(`Character ${name} does not exist`);
  }

  // determine how the type will affect damage - no DnD background to know
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
