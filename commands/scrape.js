const { SlashCommandBuilder } = require("@discordjs/builders");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");

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
        let someArray = [];
        let randomFact;
        const argUrl = interaction.options.getString("url");
        const argType = interaction.options.getString("type");
        const argFind = interaction.options.getString("find");
        const browser = await puppeteer.launch();

        const page = await browser.newPage();
        console.log(argUrl);
        console.log(typeof argUrl);
        await page.goto(`${argUrl}`);

        await page.screenshot({ path: "image_anyweb.png" });

        const pageData = await page.evaluate(() => {
            return {
                html: document.documentElement.innerHTML,
            };
        });

        //console.log(pageData);
        const $ = cheerio.load(pageData.html);
        if (argType != null && argFind != null) {
            console.log("in here 1");
            $(`${argType}`)
                .find(`${argFind}`)
                .each(function (i, el) {
                    let row = $(el).text().replace(/(\s+)/g, " ");
                    row = $(el)
                        .text()
                        .replace(/[0-9]+. /g, "")
                        .trim();
                    console.log(`${row}`);
                    someArray.push(row);
                });
        }
        if (argType != null) {
            console.log("in here 2");
            $(`${argType}`).each(function (i, el) {
                let row = $(el).text().replace(/(\s+)/g, " ");
                row = $(el)
                    .text()
                    .replace(/[0-9]+. /g, "")
                    .trim();
                console.log(`${row}`);
                someArray.push(row);
            });
        }
        if (someArray.length > 1) {
            randomFact =
                someArray[
                    Math.floor(Math.random() * someArray.length)
                ].toString();
        }
        if (someArray.length == 1) {
            randomFact = someArray[0].toString();
        }
        if (someArray.length == 0) {
            randomFact = "No data";
        }
        await browser.close();
        await interaction.channel.send(randomFact);
    },
};
