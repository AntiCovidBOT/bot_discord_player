import {EventDiscord} from "./event";

export const InteractionCreate: EventDiscord = {
	name: 'interactionCreate',
	once: false,
	execute(interaction: any) {
		if (!interaction.isCommand()) return;

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