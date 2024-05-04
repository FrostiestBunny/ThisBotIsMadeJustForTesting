const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('hero')
  .setDescription('Provides information about given Overwatch hero')
  .addStringOption((option) =>
    option
      .setName('name')
      .setDescription('The name of the hero')
      .setRequired(true)
      .setAutocomplete(true)
  );

const execute = async (interaction) => {
  const heroId = interaction.options.getString('name');
  await interaction.deferReply();

  const url = `https://overfast-api.tekrop.fr/heroes/${heroId}`;
  const req = await fetch(url);
  const reply = await req.json();

  const hero = new EmbedBuilder()
    .setTitle(reply.name)
    .setImage(reply.portrait)
    .setTimestamp();

  await interaction.editReply({ embeds: [hero] });
};

const autocomplete = async (interaction) => {
  const focusedValue = interaction.options.getFocused();
  const choices = [
    'ana',
    'ashe',
    'baptiste',
    'bastion',
    'brigitte',
    'cassidy',
    'doomfist',
    'dva',
    'echo',
    'genji',
    'hanzo',
    'illari',
    'junker-queen',
    'junkrat',
    'kiriko',
    'lifeweaver',
    'lucio',
    'mauga',
    'mei',
    'mercy',
    'moira',
    'orisa',
    'pharah',
    'ramattra',
    'reaper',
    'reinhardt',
    'roadhog',
    'sigma',
    'sojourn',
    'soldier-76',
    'sombra',
    'symmetra',
    'torbjorn',
    'tracer',
    'venture',
    'widowmaker',
    'winston',
    'wrecking-ball',
    'zarya',
    'zenyatta',
  ];
  let filtered = choices.filter((choice) => choice.startsWith(focusedValue));
  if (filtered.length > 25) filtered = filtered.slice(0, 25);
  await interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice }))
  );
};

const cooldown = 5;

module.exports = { data, execute, cooldown, autocomplete };
