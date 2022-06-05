// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { MONGO_URI } = require('./config.json');
// const { request }= require('undici');
const mongoose = require('mongoose');


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// To access commands in other files
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// To access events in other files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

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
client.once('ready', async () => {
	// await mongoose.connect(
	// 	MONGO_URI || '',
	// 	{
	// 		keepAlive: true,
	// 	}
	// 	);
	console.log('Ready!');
	await mongoose.connect(MONGO_URI, {
		
	})
	.then(() => {
		console.log("Connected to database!");
	})
	.catch((err) => {
		console.error(err);
	})
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

});	

// Login to Discord with your client's token
client.login(token);