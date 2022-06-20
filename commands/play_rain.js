const { SlashCommandBuilder } = require('@discordjs/builders');
const {	MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play-rain')
		.setDescription('Play rain song in the voice call'),
	async execute(interaction) {
		const voice_channel = message.member.voice.channel;
        const embed = new MessageEmbed()
            .setColor('#FF5757')
            .setDescription(`You need to be in a voice call to execute this command!`)

        if (!voice_channel) return message.channel.send(embed);

        const started = new MessageEmbed()
            .setColor('#85b0d2')
            .setDescription(`Started playing **${song.name}**`)

            if(song)
                message.channel.send(started);
            return;
	},
};