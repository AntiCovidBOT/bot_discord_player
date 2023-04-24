import {createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior} from "@discordjs/voice";
import {Embed} from "../embeds";
import {EmbedType} from '../types/embed';
import {SlashCommandBuilder} from "discord.js";
const play = require('play-dl');

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('play any music on your voice channel!')
        .addStringOption((option) => option.setName('query').setDescription('The song you want to play').setRequired(true)),

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

        const embed: EmbedType = {
            title: 'Playing Music',
            description: `[${yt_info[0].title}](${yt_info[0].url})`,
            color: 0x2f3136,
            thumbnail: yt_info[0].thumbnails[0].url,
            footer: {
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            },
        }

        const embedBuilder = new Embed(embed).build()

        await interaction.followUp({ embeds: [embedBuilder] });

        player.play(resource);
        connection.subscribe(player);
    }
}

