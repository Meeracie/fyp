const { SlashCommandBuilder } = require('@discordjs/builders');
const {	MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List of commands available'),
	async execute(interaction) {
		const Response = new MessageEmbed()
		.setColor("#2700eb")
        .setTitle("Help")
        .setDescription('Here are the list of commands that are available.')
        .addFields(
            
            {name: 'Break Reminder', value: "`/breakreminder [start][end][interval]`"},
            {name: 'See your Profile', value: "`/myprofile`"},
            {name: 'Meditation Music', value: "`/play-rain \n/play-water \n/play-sea`"},
            {name: 'Health', value: "`/healthfact`"},
            {name: 'Drink', value: "`/waterintake`"},
            {name: 'Others', value: "`/meme \n/bored \n/urban`"}
        );

		await interaction.reply({embeds: [Response]});
	},
};