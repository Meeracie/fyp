const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const User = require("../database/schema/user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register your user to database"),
    async execute(interaction) {
        let result = "";
        try {
            console.log("Registering user to database...");
            const checkUsers = await User.find({}).select("-_id discordId");

            // Condition to prevent user duplication in database
            let userExists = false;
            let currentUser = interaction.user.id;
            // console.log(interaction.user.username); returns string discord username
            for (const i in checkUsers) {
                if (currentUser === checkUsers[i].discordId) {
                    userExists = true;
                }
            }

            if (!userExists) {
                const newUser = await User.create({
                    username: interaction.user.username,
                    discordId: interaction.user.id,
                    reminder: "",
                    reminderStop: false,
                    reminderOngoing: false,
                });
                result += "Created user to database!";
                console.log("Created user to database!");
            } else {
                result += "User already registered!";
                console.log("User already registered!");
            }
        } catch (err) {
            console.error(err);
        }
        await interaction.reply(result);
    },
};
