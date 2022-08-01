const { SlashCommandBuilder } = require('@discordjs/builders');
const {	MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cup')
		.setDescription('Sends you daily water intake based on your weight')
        .addNumberOption((option) => {
            return option
                .setName("kg")
                .setRequired(true)
                .setDescription("Input your weight in kg");
        }),
	async execute(interaction) {
        let waterIntake = 0;
        let cup = 0;
        try {
            const userWeight = interaction.options.get("kg").value;
            console.log("userWeight: ", userWeight);

            waterIntake = userWeight * 0.033;
            cup = Math.floor(waterIntake * 4.227);
        }
        catch (err) {
            console.error(err);
        }

        const botLatency = Date.now() - interaction.createdTimestamp;
        const ping = interaction.client.ws.ping;

        const water = new MessageEmbed()
			.setColor("#47a9ff")
            .setTitle("Daily Water Intake")
            .setDescription("You should drink about `" + waterIntake.toFixed(2) + "` litres per day")
            .addField("Cups of water :cup_with_straw:", `${cup}`)
            .setFields(
                { name: "Latency🏓", value: `${botLatency}ms`, inline: true },
                { name: "API Latency🏓", value: `${ping}ms`, inline: true },
            )


		await interaction.reply({embeds: [water], ephemeral: [true]});


	},
};