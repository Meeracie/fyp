const { SlashCommandBuilder } = require('@discordjs/builders');
const {	MessageEmbed } = require('discord.js');
const User = require("../database/schema/user");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stopreminder')
		.setDescription('Stop reminder'),
	async execute(interaction) {
        const updateStop = await User.findOne({
            discordId: interaction.user.id,
        }).updateOne({
            stop: true,
        });
		await interaction.reply('Reminder stopped!');
	},
};