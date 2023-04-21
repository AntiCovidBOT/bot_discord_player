import {createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior} from "@discordjs/voice";
const play = require('play-dl');
const { ApplicationCommandOptionType } = require('discord.js');

// module.exports = {
// 	name: 'play',
// 	description: 'play any music on your voice channel!',
// 	options: [
// 		{
// 			name: 'query',
// 			type: ApplicationCommandOptionType.String,
// 			description: 'The song you want to play',
// 			required: true,
// 		},
// 	],
//
// 	async execute(interaction: any) {
// 		const channel = interaction.member.voice?.channel
// 		if (!channel) return interaction.channel.send('Connect to a Voice Channel');
//
// 		await interaction.deferReply();
//
// 		const connection = joinVoiceChannel({
// 			channelId: interaction.member.voice.channel.id,
// 			guildId: interaction.guild.id,
// 			adapterCreator: interaction.guild.voiceAdapterCreator
// 		});
//
// 		const args = interaction.options.getString('query');
// 		const yt_info = await play.video_info(args);
// 		const stream = await play.stream_from_info(yt_info);
//
// 		const resource = createAudioResource(stream.stream, {
// 			inputType: stream.type,
// 		});
//
// 		const player = createAudioPlayer({
// 			behaviors: {
// 				noSubscriber: NoSubscriberBehavior.Play,
// 			},
// 		});
//
// 		player.play(resource);
// 		connection.subscribe(player);
// 	},
// };
