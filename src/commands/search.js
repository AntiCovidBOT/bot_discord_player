const { ApplicationCommandOptionType } = require('discord.js');
const play = require('play-dl');
const { createAudioResource, createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	name: 'search',
	description: 'play any music on your voice channel!',
	options: [
		{
			name: 'link',
			type: ApplicationCommandOptionType.String,
			description: 'The song you want to play',
			required: true,
		},
		{
			name: 'query',
			type: ApplicationCommandOptionType.String,
			description: 'The song you want to search to play',
			required: true,
		},
	],

	async execute(interaction) {
		const channel = interaction.member.voice?.channel;
		if (!channel) return interaction.channel.send('Connect to a Voice Channel');

		await interaction.deferReply();

		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});

		const args = interaction.options.getString('query');
		const yt_info = await play.search(args, { limit: 1 });
		const stream = await play.stream(yt_info[0].url);

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
	},
};