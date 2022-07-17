const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const User = require("../database/schema/user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stopreminder")
        .setDescription("Stop reminder"),
    async execute(interaction) {
        let findUserOngoing = await User.findOne({discordId: interaction.user.id,}).select("-_id reminderOngoing");
        let checkUserOngoing = findUserOngoing.reminderOngoing;

        if(checkUserOngoing === false) {
            await interaction.reply("No ongoing reminder!");
            return;
        }
        console.log("force stop");
        const updateStop = await User.findOne({
            discordId: interaction.user.id,
        }).updateOne({
            reminderStop: true,
        });

        setTimeout(async () => {
			// const updateStopFalse = await User.findOne({
			// 	discordId: interaction.user.id,
			// }).updateOne({
			// 	reminderStop: false,
			// });
            const updateOngoingFalse = await User.findOne({
                discordId: interaction.user.id,
            }).updateOne({
                reminderOngoing: false,
            });
        }, 2000);
        await interaction.reply("Reminder stopped!");
    },
};
