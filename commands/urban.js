const { SlashCommandBuilder } = require('@discordjs/builders');
const { request }= require('undici');
const {	MessageEmbed } = require('discord.js');

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}

	return JSON.parse(fullBody);
}



module.exports = {
    data: new SlashCommandBuilder()
        .setName('urban')
        .setDescription('An urban dictionary')
        .addStringOption(option => option.setName('term').setDescription('Define')),
    async execute(interaction) {
        const term = interaction.options.getString('term');
		const query = new URLSearchParams({ term });

		const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
		const { list } = await getJSONResponse(dictResult.body);

        const botLatency = Date.now() - interaction.createdTimestamp;
        const ping = interaction.client.ws.ping;

        const embed = new MessageEmbed()
        .setTitle('Definition')
        .setDescription(`**${term}**: ${list[0].definition}`)
        .setFields(
            { name: "Latency🏓", value: `${botLatency}ms`, inline: true },
            { name: "API Latency🏓", value: `${ping}ms`, inline: true },
        )

        await interaction.reply({embeds: [embed]});
    },
};