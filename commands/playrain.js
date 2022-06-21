const { SlashCommandBuilder } = require('@discordjs/builders');
const {	MessageEmbed } = require('discord.js');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource
} = require('@discordjs/voice');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play-rain')
		.setDescription('Play rain sound music in the voice call'),
	async execute(interaction) {
        const voiceChannel = interaction.guild.members.cache.get(interaction.member.user.id).voice.channel;

        if (!voiceChannel)
            return interaction.channel.send( 
                "❌ You need to be in a voice channel to play music!"
            );

            const permissions = voiceChannel.permissionsFor(interaction.client.user);
            //console.log(interaction.client.user);
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                return interaction.channel.send(
                "I need the permissions to join and speak in your voice channel!"
                );
            }
        
        //creating voice connection
        const connection = joinVoiceChannel({
            channelId: interaction.guild.members.cache.get(interaction.member.user.id).voice.channelId,
            guildId: interaction.channel.guild.id,
            adapterCreator: interaction.channel.guild.voiceAdapterCreator,
        });
        
        const player = createAudioPlayer()
        const resource = createAudioResource('./assets/song1.mp3')
        
        // Subscribe the connection to the audio player (will play audio on the voice connection)
        connection.subscribe(player)

        player.play(resource)
		
        const start = new MessageEmbed()
			.setColor("#9ae890")
			.setDescription("`Okay! Begin by taking a deep breath and lets meditate together.`")
			.setThumbnail('https://i.imgur.com/xEq0TSA.jpg')
            .setImage('https://i.imgur.com/lTUIm2K.jpg')
            .setFooter({text: 'Now playing: First Rain in Spring - BigRicePiano'});

		await interaction.reply({embeds: [start]});
	},
};