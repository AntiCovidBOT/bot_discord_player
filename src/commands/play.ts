import {createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior} from "@discordjs/voice";
import {Command} from "./command";
const play = require('play-dl');
const { ApplicationCommandOptionType } = require('discord.js');

export const Play: Command = {
    name: "play",
    description: "play any music on your voice channel!",
    options: [
        {
            name: "query",
            type: ApplicationCommandOptionType.String,
            description: "The song you want to play",
            required: true,
        },
    ],
    async execute(interaction: any) {
        const channel = interaction.member.voice?.channel
        if (!channel) return interaction.channel.send('Connect to a Voice Channel');

        await interaction.deferReply();

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        const args = interaction.options.getString('query');
        let yt_info = await play.search(args, { limit: 1 });
        let stream = await play.stream(yt_info[0].url);

        if (args.toString().includes('https://')) {
            yt_info = await play.video_info(args);
            stream = await play.stream_from_info(yt_info);
        }

        const resource = createAudioResource(stream.stream, {
            inputType: stream.type,
        });

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            },
        });

        player.play(resource);
        connection.subscribe(player);
    }
}

