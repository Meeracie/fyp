const { SlashCommandBuilder } = require('@discordjs/builders');
const {	MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('waterintake')
		.setDescription('Replies with Pong!')
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

        const water = new MessageEmbed()
			.setColor("#47a9ff")
            .setTitle("Water Intake")
            .setDescription("You should drink about `" + waterIntake.toFixed(2) + "` litres")
            .addField("Cups of water :cup_with_straw:", `${cup}`)

		await interaction.reply({embeds: [water], ephemeral: [true]});
	},
};