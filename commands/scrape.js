const { SlashCommandBuilder } = require("@discordjs/builders");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");
const file = require("./facts.json");
const fs = require("fs");
const { log } = require("console");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("scrape")
        .setDescription("Scrape from website")
        .addStringOption((option) => {
            return option
                .setName("url")
                .setRequired(true)
                .setDescription("example.com/<optional>");
        })
        .addStringOption((option) => {
            return option
                .setName("type")
                .setRequired(true)
                .setDescription(".Class / #Id");
        })
        .addStringOption((option) => {
            return option
                .setName("find")
                .setDescription("Find specific element");
        }),
    async execute(interaction) {
        // let randomFact = null;
        let alyph = "834638969945587712";
        let meer = "249062107834875905";
        if (interaction.user.id === alyph || interaction.user.id === meer) {
            let someArray = [];
            let currentTotal = file.content.answers.length;
            let randomFact = "No data found!";
            let totalLoaded = 0;
            const argUrl = interaction.options.getString("url");
            const argType = interaction.options.getString("type");
            const argFind = interaction.options.getString("find");

            await interaction.deferReply({ ephemeral: true });
            const browser = await puppeteer.launch();

            const page = await browser.newPage();
            await page.goto(`${argUrl}`);

            //await page.screenshot({ path: "image_anyweb.png" });

            const pageData = await page.evaluate(() => {
                return {
                    html: document.documentElement.innerHTML,
                };
            });

            const $ = cheerio.load(pageData.html);

            if (argType != null && argFind != null) {
                $(`${argType}`)
                    .find(`${argFind}`)
                    .each(function (i, el) {
                        let row = $(el).text().replace(/(\s+)/g, " ");
                        row = $(el)
                            .text()
                            .replace(/[0-9]+\. /g, "")
                            .trim();
                        console.log(`${row}`);
                        someArray.push(row);
                    });
            }
            if (argType != null) {
                let $title = $(`${argType}`);
                let rnd = Math.floor(Math.random() * $title.length);

                $(`${argType}`).each(function (i, el) {
                    let row = $(el).text().replace(/(\s+)/g, " ");
                    row = $(el)
                        .text()
                        .replace(/[0-9]+\. /g, "")
                        .trim();
                    //console.log(`${row}`);
                    //someArray.push(row);
                    var ans = file.content.answers;

                    const fileName = "commands\\facts.json";
                    fs.writeFile(
                        fileName,
                        JSON.stringify(file),
                        function writeJSON(err) {
                            if (err) return console.log(err);
                            let exists = file.content.answers.some(
                                (item) => item === row
                            );
                            console.log(exists);
                            if (!exists) {
                                file.content.answers.push(row);
                                //console.log(JSON.stringify(file));
                                // console.log("writing to " + fileName);
                                // console.log(ans.length);
                            } else {
                                console.log("Already exists!");
                            }
                        }
                    );
                });
            }

            // if (rnd > 0) {
            //     randomFact = $title
            //         .text()
            //         .replace(/[0-9]+\. /g, "")
            //         .trim();
            //     //someArray.push(randomFact);
            //     console.log(randomFact);

            //     // Append new element to JSON file
            //     var ans = facts.content.answers;
            //     const fileName = "commands\\facts.json";
            //     fs.writeFile(
            //         fileName,
            //         JSON.stringify(file),
            //         function writeJSON(err) {
            //             if (err) return console.log(err);
            //             let exists = file.content.answers.some(
            //                 (item) => item === randomFact
            //             );
            //             if (!exists) {
            //                 file.content.answers.push(randomFact);
            //                 console.log(JSON.stringify(file));
            //                 console.log("writing to " + fileName);
            //                 console.log(ans.length);
            //             } else {
            //                 console.log("Already exists!");
            //             }
            //         }
            //     );
            // } else {
            //     randomFact = "No data";
            //     console.log("No data");
            // }
            // if (someArray.length > 1) {
            //     randomFact =
            //         someArray[
            //             Math.floor(Math.random() * someArray.length)
            //         ].toString();
            // }
            // if (someArray.length == 1) {
            //     randomFact = someArray[0].toString();
            // }
            // if (someArray.length == 0) {
            //     randomFact = "No data";
            // }
            await browser.close();
            totalLoaded = file.content.answers.length - currentTotal;
            console.log("Current total: ", currentTotal);
            console.log("Total loaded: ", totalLoaded);

            randomFact = `Total loaded to facts.json = ${totalLoaded}`;
            await interaction.editReply(randomFact);
        } else {
            return await interaction.reply({
                content: "You are not allowed to use this command!",
                ephemeral: true,
            });
        }
    },
};
