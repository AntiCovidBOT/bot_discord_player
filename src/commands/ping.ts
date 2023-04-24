import {Embed, EmbedObject} from "../embeds";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('replies with pong'),
	async execute(interaction: ChatInputCommandInteraction) {
		const embed: EmbedObject = {
			title: 'Pong!',
			description: `🏓Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms`,
			color: 0x2f3136,
			thumbnail: '',
			footer: {},
		}

		await interaction.reply(`🏓Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms`);
	}
}