const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require('discord.js');
const { damage_heroes, tank_heroes, support_heroes } = require('../../util.js');

const getHeroByName = async (name) => {
  const url = `https://overfast-api.tekrop.fr/heroes/${name}`;
  const req = await fetch(url);
  const reply = await req.json();
  return reply;
};

const pickRandomHero = async (hero_pool, interaction) => {
  const hero_name = hero_pool[Math.floor(Math.random() * hero_pool.length)];

  const reply = await getHeroByName(hero_name);

  const hero = new EmbedBuilder().setTitle(reply.name).setImage(reply.portrait);

  if (reply.name === 'Winston') {
    await interaction.channel.send('This is Winston');
  }

  return hero;
};

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

  const subCommand = interaction.options.getSubcommand();

  if (subCommand === 'tank') {
    hero_pool = tank_heroes;
  } else if (subCommand === 'damage') {
    hero_pool = damage_heroes;
  } else if (subCommand === 'support') {
    hero_pool = support_heroes;
  }

  const hero = await pickRandomHero(hero_pool, interaction);

  const reroll = new ButtonBuilder()
    .setCustomId('reroll')
    .setLabel('Reroll hero')
    .setStyle(ButtonStyle.Primary);

  const row2 = new ActionRowBuilder().addComponents(reroll);

  const response = await interaction.editReply({
    embeds: [hero],
    components: [row2],
  });

  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60 * 60 * 1_000,
  });

  collector.on('collect', async (i) => {
    if (i.user.id === interaction.user.id) {
      const new_hero = await pickRandomHero(hero_pool, i);
      await i.update({ embeds: [new_hero] });
    } else {
      await i.reply({
        content: `Hey, this wasn't meant for you, ${i.member.displayName}!`,
        ephemeral: true,
      });
    }
  });
};

const cooldown = 5;

module.exports = { data, execute, cooldown };
