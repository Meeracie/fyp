const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const User = require("../database/schema/user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stopreminder")
        .setDescription("Stop reminder"),
    async execute(interaction) {
        const updateStop = await User.findOne({
            discordId: interaction.user.id,
        }).updateOne({
            reminderStop: true,
        });

        setTimeout(async () => {
			const updateStopFalse = await User.findOne({
				discordId: interaction.user.id,
			}).updateOne({
				reminderStop: false,
			});
        }, 1000);
        await interaction.reply("Reminder stopped!");
    },
};
