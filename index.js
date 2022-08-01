// Require the necessary discord.js classes
//require('newrelic');
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config.json");
const { MONGO_URI } = require("./config.json");
// const { request }= require('undici');
const mongoose = require("mongoose");
// const testSchema = require('./test-schema');
const User = require("./database/schema/user");

// Create a new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES],
});
// client.Database = require('./database/mongoose');

// To access commands in other files
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

// To access events in other files
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// When the client is ready, run this code (only once)
client.once("ready", async () => {
    // await mongoose.connect(
    // 	MONGO_URI || '',
    // 	{
    // 		keepAlive: true,
    // 	}
    // 	);
    console.log("Ready!");
    await mongoose
        .connect(MONGO_URI, {})
        .then(() => {
            console.log("Connected to database!");
        })
        .catch((err) => {
            console.error(err);
        });

    // setTimeout(async () => {
    // 	await new testSchema({
    // 		message: 'hello world?',
    // 	}).save()
    // }, 1000)
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});

// Add user to db every time they send message
// client.on("messageCreate", async (message) => {
//     if (message.content.toLowerCase() === "!register") {
//         console.log("Creating new user ...");
//         console.log(`message.author.bot=${message.author.bot}`);
//         if (message.author.bot) return;
//         // condition to prevent dupes
//         const checkUsers = await User.find({}).select("-_id username");
//         let userExists = false;
//         console.log(`message.author.username=${message.author.username}`);
//         for (const i in checkUsers) {
//             if (message.author.username === checkUsers[i].username) {
//                 userExists = true;
//             }
//         }
//         if (!userExists) {
//             const newUser = await User.create({
//                 username: message.author.username,
//                 discordId: message.author.id,
//             });
//             //const savedUser = await newUser.save();
//             console.log("Created new user!");
//         } else {
//             console.log("User already exists!");
//         }
//     }
//     if (message.content.toLowerCase() === "!users") {
//         // const totalUsers = await User.find({}, {
//         //     "_id": 0,
//         //     "username": 1
//         // });
//         const totalUsers = await User.find({}).select("-_id username");
//         console.log(`Users: ${totalUsers}`);
//         let resultUsers = "";
//         for (const i in totalUsers) {
//             resultUsers += `${totalUsers[i].username} `;
//         }
//         // for (let i = 0; i < totalUsers.length; i++) {
//         //     message.channel.send(totalUsers[i].username);
//         // }
//         // message.channel.send(totalUsers.toString());
//         message.channel.send(resultUsers);
//     }
// });

// Add user to db when they join the server
client.on("guildMemberAdd", async (member) => {
    // console.log('Member displayName', member.displayName);
    // console.log('Member id', member.id);
    const newMember = await User.create({
        username: member.displayName,
        discordId: member.id,
        reminder: "",
        reminderStop: false,
        reminderOngoing: false,
    });
    console.log("Guild member added");
});

// client.on('message', async (message) => {
//     const newUser = new User({
//         username: message.author.username,
//         discordId: message.author.id,
//     });
//     const savedUser = await newUser.save();
//     console.log('Create new user!');
// });

// Login to Discord with your client's token
client.login(token);
