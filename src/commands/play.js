const { ApplicationCommandOptionType } = require("discord.js");
const { Player } = require('discord-player')

module.exports = {
  name: 'play',
  description: 'play any music on your voice channel!',
  options: [
    {
      name: "query",
      type: ApplicationCommandOptionType.String,
      description: "The song you want to play",
      required: true
    }
  ],

  async execute(interaction) {
    const player = new Player(interaction.client);




    await interaction.reply('play any music')
  }
}
