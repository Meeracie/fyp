const { SlashCommandBuilder } = require('@discordjs/builders');
const {	MessageEmbed } = require('discord.js');
const moment = require('moment');
const facts = require('./facts.json')
// const mongoose = require('mongoose');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('healthfact')
		.setDescription('Sends you a random health fact'),
	async execute(interaction) {   
        var healthfacts=facts.content.Health;
        var ans= healthfacts[0].answers; //the number 1 define to the array number 1 in the file json, so that's why "answers" is 1 and "questions" is 0
        
        var randPhrase=Math.floor(Math.random()*(ans.length)); //here a random to get a random phrase from the json file
		let result = await ans[randPhrase];
		// const healthFact = await mongoose.find(); 
		// console.log(healthFact);
		const response = new MessageEmbed()
			.setColor("#e31e80")
			.setTitle("Health Fact")
			.setDescription(result)
			.setThumbnail('https://i.imgur.com/tXeiZtM.png')

		await interaction.reply({embeds: [response]});
	},
};