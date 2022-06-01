const { SlashCommandBuilder } = require('@discordjs/builders');
const { request }= require('undici');

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
        await interaction.reply(`**${term}**: ${list[0].definition}`);
    },
};