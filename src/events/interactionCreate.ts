import {ChatInputCommandInteraction, Collection, Interaction, SlashCommandBuilder} from "discord.js";
import {Command} from "../ interfaces/command";

export default {
	name: 'interactionCreate',
	once: false,
	async execute(commands: Collection<string, Command>, interaction: any) {
		if (!interaction.isChatInputCommand()) return;

		const command = commands.get(interaction.commandName);
		if (!command) return;

		try {
			await command.execute(interaction as ChatInputCommandInteraction);
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: 'Oops! Hubo un error al ejecutar el comando :)', ephemeral: true });
		}
	}
}
