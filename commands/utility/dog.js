const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('dog')
  .setDescription('Get a random dog image')
  .addStringOption((option) =>
    option
      .setName('breed')
      .setDescription('Provide the breed')
      .setAutocomplete(true)
  );

const execute = async (interaction) => {
  await interaction.deferReply();

  const breed = interaction.options.getString('breed');
  let dog_image;
  if (!breed) {
    const req = await fetch('https://dog.ceo/api/breeds/image/random');
    const reply = await req.json();
    dog_image = reply.message;
  } else {
    const req = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
    const reply = await req.json();
    dog_image = reply.message;
  }

  await interaction.editReply(dog_image);
};

let breeds_cache = [];

const getAllBreeds = async () => {
  if (breeds_cache.length != 0) {
    return breeds_cache;
  }
  const req = await fetch('https://dog.ceo/api/breeds/list/all');
  const reply = await req.json();
  const breeds = Object.keys(reply.message);
  breeds_cache = breeds;
  return breeds;
};

const autocomplete = async (interaction) => {
  const focusedValue = interaction.options.getFocused();
  const choices = await getAllBreeds();
  let filtered = choices.filter((choice) => choice.startsWith(focusedValue));
  if (filtered.length > 25) filtered = filtered.slice(0, 25);
  await interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice }))
  );
};

const cooldown = 5;

module.exports = { data, execute, cooldown, autocomplete };
