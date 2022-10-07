module.exports = {
  name: "ping",
  description: "replies with pong",

  async execute(interaction) {
    await interaction.reply(`🏓Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms`);
  }
};
