import {
    ApplicationCommandDataResolvable,
    Client,
    Collection,
    GatewayIntentBits,
    REST,
    Routes,
    Snowflake
} from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import {Command} from "../ interfaces/command";
import * as dotenv from 'dotenv'
import Music from "./music";

dotenv.config()

const TOKEN = process.env.TOKEN || '';
const CLIENT_ID = process.env.CLIENT_ID || '';

export class Bot {
    slashCommands = new Array<ApplicationCommandDataResolvable>();
    slashCommandsMap = new Collection<string, Command>();
    queues = new Collection<Snowflake, Music>();

    constructor(readonly client: Client) {
        this.client = client;

        this.setClientCommands().then(() => console.log('Commands registered'))
        this.setClientEvents().then(() => console.log('Events registered'))
        this.loginBot().then(() => console.log('Bot logged in'))
    }

    private async setClientCommands() {
        const commandFiles = readdirSync(join(__dirname, "../commands")).filter((file) => !file.endsWith(".map"));

        for (const file of commandFiles) {
            const command = await import(join(__dirname, "../commands", `${file}`));
            this.slashCommands.push(command.default.data);
            this.slashCommandsMap.set(command.default.data.name, command.default);
        }

        const rest = new REST({ version: '10' }).setToken(TOKEN);
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: this.slashCommands })
    }

    private async setClientEvents() {
        const eventFiles = readdirSync(join(__dirname, "../events")).filter((file) => !file.endsWith(".map"));

        for (const file of eventFiles) {
            const event = await import(join(__dirname, "../events", `${file}`));

            if (event.default.once) {
                this.client.once(event.default.name, (...args: any[]) => event.default.execute(...args));
                continue;
            }

            this.client.on(event.default.name, (...args: any[]) => event.default.execute(this.slashCommandsMap, ...args));
        }
    }

    private async loginBot() {
        await this.client.login(TOKEN);
    }
}