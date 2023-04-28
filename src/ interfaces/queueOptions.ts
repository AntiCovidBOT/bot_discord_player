import {CommandInteraction, TextChannel} from "discord.js";
import {AudioResource, VoiceConnection} from "@discordjs/voice";

export interface QueueOptions {
    interaction: CommandInteraction;
    textChannel: TextChannel;
    connection: VoiceConnection;
}