const { SlashCommandBuilder } = require('@discordjs/builders');
const {	MessageEmbed, Client } = require('discord.js');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const latency = Math.abs(Date.now() - interaction.createdTimestamp);
		await interaction.reply('Pong ', latency, 'ms');
		interaction.editReply({content: `> 🏓 Pong! Latency: **${interaction.client.ws.ping}ms**`});
	}
};