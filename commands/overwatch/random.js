const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { damage_heroes, tank_heroes, support_heroes } = require('../../util.js');

const data = new SlashCommandBuilder()
  .setName('random')
  .setDescription('Pick a random OW hero.')
  .addSubcommand((subcommand) =>
    subcommand.setName('tank').setDescription('Tank heroes')
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('damage').setDescription('Damage heroes')
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('support').setDescription('Support heroes')
  );

const execute = async (interaction) => {
  await interaction.deferReply();
  let hero_pool;

  if (interaction.options.getSubcommand() === 'tank') {
    hero_pool = tank_heroes;
  } else if (interaction.options.getSubcommand() === 'damage') {
    hero_pool = damage_heroes;
  } else if (interaction.options.getSubcommand() === 'support') {
    hero_pool = support_heroes;
  }

  const hero_name = hero_pool[Math.floor(Math.random() * hero_pool.length)];

  const url = `https://overfast-api.tekrop.fr/heroes/${hero_name}`;
  const req = await fetch(url);
  const reply = await req.json();

  const hero = new EmbedBuilder().setTitle(reply.name).setImage(reply.portrait);

  await interaction.editReply({ embeds: [hero] });
};

const cooldown = 5;

module.exports = { data, execute, cooldown };
