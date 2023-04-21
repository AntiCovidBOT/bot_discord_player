import {Command, CommandBot} from "./commands/command";
import {EventBot, EventDiscord} from "./events/event";
import {Ping} from "./commands/ping";
import {Ready} from "./events/ready";
import {InteractionCreate} from "./events/interactionCreate";
import {ClientEvents} from "discord.js";

const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const { TOKEN, CLIENT_ID, GUILD_ID } = require('../config.json');

class BotTest {
	rest: any;
	client: any;
	commands: Command[];
	events: EventDiscord[];

	constructor(client: any) {
		this.client = client;
		this.commands = [];
		this.events = [];
		this.rest = new REST({ version: '10' }).setToken(TOKEN);
	}

	setCommands(commands: Command[]) {
		this.commands = commands;
	}

	setEvents(events: EventDiscord[]) {
		this.events = events;
	}

	setClientCommands() {
		this.client.commands = new Collection();
		for (const command of this.commands) {
			this.client.commands.set(command.name, command);
		}

		this.rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: this.client.commands })
		.then((data: any) => console.log(`Successfully registered ${data.length} application commands.`))
		.catch(console.error);
	}

	setClientEvents() {
		for (const event of this.events) {
			if (event.once) {
				this.client.once(event.name, (...args: any[]) => event.execute(this.client, ...args));

				continue;
			}

			this.client.on(event.name, (...args: any[]) => event.execute(this.client, ...args));
		}
	}

	loginBot() {
		this.client.login(TOKEN);
	}
}

let commands: Command[] = [Ping];
let events: EventDiscord[] = [Ready, InteractionCreate];

const commandBot = new CommandBot()
commandBot.setCommandBuild(commands)

const eventBot = new EventBot()
eventBot.setEventBuild(events)

const bot = new BotTest(new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
}))

bot.setCommands(commandBot.getCommands)
bot.setClientCommands()
bot.setEvents(events)
bot.setClientEvents()

bot.loginBot()
