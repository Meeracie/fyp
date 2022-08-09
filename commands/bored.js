const { SlashCommandBuilder } = require('@discordjs/builders');
const { request }= require('undici');
const {	MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bored')
        .setDescription('Send a random things to do'),
    async execute(interaction) {
        const url = 'http://www.boredapi.com/api/activity?type=relaxation';

        let response;
        try {
            response = await axios.get(url);
            // console.log(response.data);
        } catch (err) {
            console.error(err);
        }

        const botLatency = Date.now() - interaction.createdTimestamp;
        const ping = interaction.client.ws.ping;

        const embed = new MessageEmbed()
        .setDescription(response.data.activity)
        .setFields(
            { name: "Latency🏓", value: `${botLatency}ms`, inline: true },
            { name: "API Latency🏓", value: `${ping}ms`, inline: true },
        )
        

        await interaction.reply({embeds: [embed]});
    }
}
