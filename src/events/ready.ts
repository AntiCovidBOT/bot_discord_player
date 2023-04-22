import {Client} from "discord.js";
import {EventDiscord} from "./event";

export const Ready: EventDiscord = {
	name: 'ready',
	once: true,
	execute(client: Client) {
		console.log(`Ready! Logged in as ${client.user?.tag}`);
	},
}

