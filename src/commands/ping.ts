import {Command} from "./command";

export const Ping: Command = {
	name: 'ping',
	description: 'replies with pong',
	options: [],
	async execute(interaction: any) {
		await interaction.reply(`🏓Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms`);
	}
}
