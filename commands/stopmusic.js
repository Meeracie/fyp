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
		.setName('stop')
		.setDescription('Stop the music and leave the voice channel'),
	async execute(interaction) {
        const voiceChannel = interaction.guild.members.cache.get(interaction.member.user.id).voice.channel;

        if (!voiceChannel)
            return interaction.channel.send( 
                "You need to be in a voice channel to execute this command!"
            );

        //creating voice connection
        const connection = joinVoiceChannel({
            channelId: interaction.guild.members.cache.get(interaction.member.user.id).voice.channelId,
            guildId: interaction.channel.guild.id,
            adapterCreator: interaction.channel.guild.voiceAdapterCreator,
        });
    
        connection.destroy()
		
        const stop = new MessageEmbed()
			.setColor("#9ae890")
			.setDescription("`Bye! Thank you for meditating with me :wave:`")

		await interaction.reply({embeds: [stop]});
	},
};