const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const User = require("../database/schema/user");
var timerInterval;
let timeoutReminder;
let flagInterval;
let flagTimeout;

async function checkStop(currentUser) {
    try {
        let userdbStop = await User.findOne({
            discordId: currentUser,
        }).select("-_id reminderStop");
        // console.log("userdbStop: " + userdbStop);
        // console.log("currentUser: " + currentUser);
        let userDbStopValue = userdbStop.reminderStop;
        console.log("in checkstop: ", userDbStopValue);
        if (userDbStopValue === true) {
            clearInterval(timerInterval);
            clearTimeout(timeoutReminder);
        }

        return userDbStopValue;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function checkOngoing(currentUser) {
    try {
        let userdbOngoing = await User.findOne({
            discordId: currentUser,
        }).select("-_id reminderOngoing");
        // console.log("userdbOngoing: " + userdbOngoing);
        let userDbOngoingValue = userdbOngoing.reminderOngoing;
        console.log("in checkOngoing: ", userDbOngoingValue);
        // if (userDbOngoingValue === true) {
        //     console.log("ONGOING REMINDER!");
        // }
        // console.log("TYPE: ", typeof userDbOngoingValue);
        // console.log(
        //     "In checkOnGoing userDbOngoingValue: " + userDbOngoingValue
        // );
        return userDbOngoingValue;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("breakreminder")
        .setDescription(
            "A break reminder command that will send you a reminder message to take a break"
        )
        .addIntegerOption((option) => {
            return option
                .setName("duration")
                .setRequired(true)
                .setDescription("When the timer should duration [IN SECONDS]");
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
            // clearInterval(timerInterval);
            // clearTimeout(timeoutReminder);
            let isExist = false;
            let currentUser = interaction.user.id;
            let flag = await checkOngoing(currentUser);

            // console.log("flag: " + flag);
    
            // Prevent duplication of breakreminder when there is already reminder ongoing.
            if (flag === true) {
                // console.log(
                //     "=====================================\nONGOING!\n================================"
                // );
                await interaction.reply(
                    "Reminder is ongoing! Type /stopreminder to stop current reminder!"
                );
                return;
            }

            console.log("Checking user in database...");
            const checkUsers = await User.find({}).select("-_id");

            // console.log(checkUsers);

            // const userId = await User.find({username: 'alyph'}).select("-_id reminder");
            // console.log(`userId: ${userId}`);
            // console.log(`user reminder: ${userId[0].reminder}`);
            // console.log(userId.toString.toString())
            for (const i in checkUsers) {
                if (currentUser === checkUsers[i].discordId) {
                    isExist = true;
                    console.log("User is exist in database!");
                    // console.log(`user reminder: ${checkUsers[i].reminder}`);
                }
            }
            // for (const i in userId) {
            //     if (currentUser === userId[i].discordId) {
            //         console.log("==================")
            //         console.log(`user reminder: ${userId[i].reminder}`);
            //     }
            // }
            if (!isExist) {
                await interaction.reply(
                    "Error no user found in database! Please run command /register"
                );
                return;
            } else {
                
                // Get the user arguments
                const argDuration = interaction.options.get("duration").value;
                const argInterval = interaction.options.get("interval").value;
                // console.log(`Arguments: ${argDuration} ${argInterval}`);

                // Update user's reminder db
                const updateUser = await User.findOne({
                    discordId: currentUser,
                }).updateOne({
                    reminder: `${argDuration} ${argInterval}`,
                });
                // console.log(updateUser);

                // Parsing string to int (in seconds)
                const duration = parseInt(argDuration);
                const interval = parseInt(argInterval);
                result = `Remind me ${argDuration}`;

                // LOGIC TIMER (use setTimeout)
                const userFetch = await interaction.client.users.fetch(
                    currentUser
                );

                // check timer validation
                if (duration >= interval && interval > 0) {
                    // setTimeout(async () => {
                    //     const updateOngoingTrue = await User.findOne({
                    //         discordId: currentUser,
                    //     }).updateOne({
                    //         reminderOngoing: true,
                    //     });
                    // }, 1000);

                    const updateOngoingTrue = await User.findOne({
                        discordId: currentUser,
                    }).updateOne({
                        reminderOngoing: true,
                    });


                    let errorCheck = false;
                    // timer function here

                    timerInterval = setInterval(async () => {
                        // console.log("im in setInterval");
                        //let flag = checkStop(currentUser);
                        // console.log("flag: ", flag);
                        flagInterval = await checkOngoing(currentUser);
                        //console.log("flagInterval: ", flagInterval);
        
                        if (flagInterval === true) {
                            clearInterval(timerInterval);
                            clearTimeout(timeoutReminder);
                            
                        }
                        if (!errorCheck) {
                            userFetch
                                .send({
                                    embeds: [
                                        {
                                            color: "#ffda36",
                                            title: "Break Time!! \nLOOK AWAY FROM THE SCREEN AND STAND UP",
                                            description:
                                                "5 minute breaks will do. \nProlonged screen time is harmful. Relax your eyes.",
                                            thumbnail: {
                                                url: "https://i.imgur.com/8T0qALC.jpg",
                                            },
                                        },
                                    ],
                                })
                                .catch((error) => {
                                    // console.log("error here");
                                    errorCheck = true;
                                });
                            console.log(
                                "Sent message to ",
                                interaction.user.username
                            );
                        }
                    }, interval * 1000);

                    // console.log(errorCheck);

                    timeoutReminder = setTimeout(async () => {
                        flagInterval = await checkOngoing(currentUser);
                        // console.log("flagInterval: ", flagInterval);

                        if (flagInterval === true) {
                            clearInterval(timerInterval);
                            clearTimeout(timeoutReminder);
                        }
                        if (!errorCheck) {
                            clearInterval(timerInterval);
                            clearTimeout(timeoutReminder);
                            const updateOngoingFalse = await User.findOne({
                                discordId: interaction.user.id,
                            }).updateOne({
                                reminderOngoing: false,
                            });
                            console.log("Stop timer reminder for ", interaction.user.username);
                        }
                    }, duration * 1010);
                    // console.log("im here");
                } else {
                    await interaction.reply({
                        content:
                            "Duration must be greater than Interval!\nInterval must be greater than 0s",
                        ephemeral: true,
                    });
                    return;
                }

                const exampleEmbed = new MessageEmbed()
                    .setColor("#7972fc")
                    .setTitle("Break Reminder")
                    .setDescription("Your reminder has been set!")
                    .addField(
                        "Reminder",
                        `Duration time: ${argDuration}s \n Time interval: ${argInterval}s`
                    )
                    
                    .setThumbnail("https://i.imgur.com/uZvm9tC.gif");
                //.setImage('https://imgur.com/uZvm9tC');

                await interaction.reply({
                    embeds: [exampleEmbed],
                });
            }
        } catch (err) {
            console.error(err);
        }
    },
};
