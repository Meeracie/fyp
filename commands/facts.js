const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const facts = require("./facts.json");
const file = require("./facts.json");
const fs = require("fs");

// function appendObject(obj) {
//     var configFile = fs.readFileSync("E:\\AmeCode\\fyp\\commands\\facts.json");
//     var config = JSON.parse(configFile);
//     config.push(obj);
//     var configJSON = JSON.stringify(config);
//     fs.writeFileSync("E:\\AmeCode\\fyp\\commands\\facts.json", configJSON);
// }
// const mongoose = require('mongoose');

// async function getResult() {
// 	let result = "None";
// 	fs.readFile('commands\\facts.json', (err, data) => {
		
// 		if (err) throw err;
// 		let factsJson = JSON.parse(data);
// 		let listFacts = factsJson.content.answers;
// 		var randPhrase = Math.floor(Math.random() * listFacts.length);
// 		result = listFacts[randPhrase];
// 		console.log(result);
// 	});
// 	return result;
// }

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fact")
        .setDescription("Sends you a random health fact"),
    async execute(interaction) {
		await interaction.deferReply();
        var ans = facts.content.answers;
        // var ans= healthfacts[0].answers; //the number 1 define to the array number 1 in the file json, so that's why "answers" is 1 and "questions" is 0
        // console.log(ans.length);
        
		// // Append new element to json file
		// let newElement = "Hello World!";
        // const fileName = "commands\\facts.json";
        // fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
        //     if (err) return console.log(err);
        //     let exists = file.content.answers.some(
        //         (item) => item === newElement
        //     );
        //     if (!exists) {
		// 		file.content.answers.push(newElement);
        //         console.log(JSON.stringify(file));
        //         console.log("writing to " + fileName);
        //         console.log(ans.length);
        //     }
		// 	else {
		// 		console.log(`${newElement} Already exists!`);
		// 	}
        // });
	
        var randPhrase = Math.floor(Math.random() * ans.length); //here a random to get a random phrase from the json file
        let result = ans[randPhrase];
		
		// let result = await getResult();
		// fs.readFile('commands\\facts.json', (err, data) => {
		// 	if (err) throw err;
		// 	let factsJson = JSON.parse(data);
		// 	let listFacts = factsJson.content.answers;
		// 	var randPhrase = Math.floor(Math.random() * listFacts.length);
		// 	result = listFacts[randPhrase];
		// 	console.log(result);
		// });
        // const healthFact = await mongoose.find();
        // console.log(healthFact);

        const botLatency = Date.now() - interaction.createdTimestamp;
        const ping = interaction.client.ws.ping;

        const response = new MessageEmbed()
            .setColor("#e31e80")
            .setTitle("Fact (Alpha)")
            .setDescription(result)
            .setThumbnail("https://i.imgur.com/tXeiZtM.png")
            .setFields(
                { name: "Latency🏓", value: `${botLatency}ms`, inline: true },
                { name: "API Latency🏓", value: `${ping}ms`, inline: true }
            );

        await interaction.editReply({ embeds: [response] });
    },
};
