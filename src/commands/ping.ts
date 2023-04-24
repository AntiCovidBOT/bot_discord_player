import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('replies with pong'),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply(`🏓Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms`);
	}
}