const { SlashCommandBuilder } = require("@discordjs/builders");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");

// (async () => {
//     console.log('Im in');
//         const browser = await puppeteer.launch();

//         const page = await browser.newPage();
//         await page.goto('https://www.thegoodbody.com/health-facts/');

//         await page.screenshot({ path: 'image.png' });

//         await browser.close();
//         console.log('Im out');

// })();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tips")
        .setDescription("Scrap from website"),
    async execute(interaction) {
        let randomFact;
        let healthArray = [];

        const browser = await puppeteer.launch();

        const page = await browser.newPage();
        await page.goto("https://www.thegoodbody.com/health-facts/");

        //await page.screenshot({ path: "image.png" });

        const pageData = await page.evaluate(() => {
            return {
                html: document.documentElement.innerHTML,
            };
        });

        //console.log(pageData);

        const $ = cheerio.load(pageData.html);
        //const element = $()
        $(".round-number")
            .find("h3")
            .each(function (i, el) {
                let row = $(el).text().replace(/(\s+)/g, " ");
                row = $(el)
                    .text()
                    .replace(/[0-9]+. /g, "")
                    .trim();
                console.log(`${row}`);
                healthArray.push(row);
            });

        await browser.close();
        // console.log("Im out");
        console.log("healthArray: ", healthArray);
        console.log("total array: ", healthArray.length);
        randomFact =
            healthArray[
                Math.floor(Math.random() * healthArray.length)
            ].toString();
        console.log(`Random Health Fact: ${randomFact}`);
        //interaction.channel.send(randomFact);

        await interaction.reply(randomFact);
    },
};
