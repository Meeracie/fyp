const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const User = require("../database/schema/user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("breakreminder")
        .setDescription(
            "A break reminder command that will send you a reminder message to take a break"
        )
        .addIntegerOption((option) => {
            return option
                .setName("start")
                .setRequired(true)
                .setDescription("When the timer should start [IN SECONDS]");
        })
        .addIntegerOption((option) => {
            return option
                .setName("end")
                .setRequired(true)
                .setDescription("When the timer should end [IN SECONDS]");
        })
        .addIntegerOption((option) => {
            return option
                .setName("interval")
                .setRequired(true)
                .setDescription(
                    "Interval how many time should the bot remind you to take a break [IN SECONDS]"
                );
        }),
    async execute(interaction) {
        let result = "";
        try {
            console.log("Checking user in database...");
            const checkUsers = await User.find({}).select("-_id");
            // console.log(checkUsers);
            let isExist = false;
            let currentUser = interaction.user.id;
            // const userId = await User.find({username: 'alyph'}).select("-_id reminder");
            // console.log(`userId: ${userId}`);
            // console.log(`user reminder: ${userId[0].reminder}`);
            // console.log(userId.toString.toString())
            for (const i in checkUsers) {
                if (currentUser === checkUsers[i].discordId) {
                    isExist = true;
                    console.log("User is exist in database!");
                    console.log(`user reminder: ${checkUsers[i].reminder}`);
                }
            }
            // for (const i in userId) {
            //     if (currentUser === userId[i].discordId) {
            //         console.log("==================")
            //         console.log(`user reminder: ${userId[i].reminder}`);
            //     }
            // }
            if (!isExist) {
                result +=
                    "User does not exist in database! Please run /register";
                // interaction.channel.send("User does not exist in database! Please run /register");
            } else {
                // result += "Run reminder";

                // Get the user arguments
                const argStart = interaction.options.get("start").value;
                const argEnd = interaction.options.get("end").value;
                const argInterval = interaction.options.get("interval").value;
                console.log(`Arguments: ${argStart} ${argEnd} ${argInterval}`);

                // Update user's reminder db
                const updateUser = await User.findOne({
                    discordId: currentUser,
                }).updateOne({
                    reminder: `${argStart} ${argEnd} ${argInterval}`,
                });
                // console.log(updateUser);

                // Parsing string to int
                const start = parseInt(argStart);
                const end = parseInt(argEnd);
                const interval = parseInt(argInterval);
                result = `Remind me ${argEnd}`

                // Execute the reminder [Timer logic] (TO DO)

                // const userFetch = await interaction.client.users
                //     .fetch(currentUser)
                //     .then((user) => {
                //         user.send("Take a break!").catch((error) => {
                //             // console.log('ERROR')
                //             result.replace(
                //                 "Your DMs is closed! Please allow direct messages from server members from server's Privacy Settings!"
                //             );
                //         });
                //     });
                let checkOk = true;

                const userFetch = await interaction.client.users.fetch(
                    currentUser
                );
                userFetch.send("Take a break!").catch((error) => {
                    interaction.channel.send("Your DMs is closed! Please allow direct messages from server's Privacy Settings!");
                    result = "Your DMs is closed! Please allow direct messages from server members from server's Privacy Settings!";
                });

                // const userFetch = interaction.client.user.fetch(currentUser)
                //     .then((user) => {

                //         user.send("Take a break!")
                        
                //     }
                //     )
                //     .catch((error) => {
                //         console.error(error);
                //         current.result = "Your DMs are closed!";
                //     });
                
                console.log(`checkOk: ${checkOk}`);
                console.log(`RESULT: ${result}`);
                
            }
        } catch (err) {
            console.error(err);
        }
        await interaction.channel.send(result);
        // await interaction.reply({content: result, ephemeral: true});
    },
};
