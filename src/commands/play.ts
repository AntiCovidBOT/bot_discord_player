import {
    createAudioPlayer,
    DiscordGatewayAdapterCreator,
    joinVoiceChannel,
    NoSubscriberBehavior
} from "@discordjs/voice";
import {Embed} from "../embeds";
import {EmbedType} from '../types/embed';
import {SlashCommandBuilder, TextChannel} from "discord.js";
import {Song} from "../domain/song";
import { bot } from '../index';
import Music from "../domain/music";

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('play any music on your voice channel!')
        .addStringOption((option) => option.setName('query').setDescription('The song you want to play').setRequired(true)),

    async execute(interaction: any) {
        const channel = interaction.member.voice?.channel
        if (!channel) return interaction.channel.send('Connect to a Voice Channel');

        await interaction.deferReply();

        const args = interaction.options.getString('query');
        const song = await Song.fromYoutube(args)

        const queue = bot.queues.get(interaction.guild!.id);
        if (queue) {
            queue.enqueue(song);

            return interaction.followUp(`**${song.title}** added to queue!`)
        }

        const newQueue = new Music({
            interaction,
            textChannel: interaction.channel! as TextChannel,
            connection: joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
            })
        });

        bot.queues.set(interaction.guild!.id, newQueue);
        newQueue.enqueue(song);

        const embed: EmbedType = {
            title: 'Playing Music',
            description: `**[${song.title}](${song.duration})**`,
            color: 0x2f3136,
            footer: {
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            },
        }

        const embedBuilder = new Embed(embed).build()
        await interaction.followUp({ embeds: [embedBuilder] });
    }
}

