const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { TOKEN, CLIENT_ID, GUILD_ID } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(TOKEN);
const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});

// Register Commands
const commandPath = path.join(__dirname, 'src/commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

client.commands = new Collection();
for (const file of commandFiles) {
	const filePath = path.join(commandPath, file);
	const command = require(filePath);

	client.commands.set(command.name, command);
}

// const rest = new REST({ version: 10 }).setToken(SECRET);
rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: client.commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);


// Registering Events
const eventsPath = path.join(__dirname, 'src/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));

		continue;
	}

	client.on(event.name, (...args) => event.execute(...args));
}

client.login(TOKEN);
