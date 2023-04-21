import {EventDiscord} from "./event";
import {Interaction} from "discord.js";
import {Command} from "../commands/command";

export const InteractionCreate: EventDiscord = {
	name: 'interactionCreate',
	once: false,
	execute(commands: Command[]) {
		// if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) return;

		try {
			command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: 'Oops! Hubo un error al ejecutar el comando :)', ephemeral: true });
		}
	}
}