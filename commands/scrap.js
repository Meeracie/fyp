const { SlashCommandBuilder } = require('@discordjs/builders');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js');

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
        .setName('scrape')
        .setDescription('Scrap from website'),
    async execute(interaction) {
        // let randomFact = null;
        let healthArray = [];
        (async () => {
            console.log('Im in');
            const browser = await puppeteer.launch();

            const page = await browser.newPage();
            await page.goto('https://www.thegoodbody.com/health-facts/');

            await page.screenshot({ path: 'image.png' });

            const pageData = await page.evaluate(() => {
                return {
                    html: document.documentElement.innerHTML,
                };
            });

            //console.log(pageData);

            const $ = cheerio.load(pageData.html);
            const element = $(
                '#chocolate-is-good-for-your-skin-its-antioxidants-improve-blood-flow-and-protect-against-uv-damage'
            );
            const element2 = $(
                '#laughing-is-good-for-the-heart-and-can-increase-blood-flow-by-20-percent'
            );
            // not efficient!! (try to get the class instead of id using correct jquery)
            console.log(element.text());
            console.log(element2.text());
            healthArray.push(element.text());
            healthArray.push(element2.text());

            let randomFact = healthArray[Math.floor(Math.random() * healthArray.length)];
            // console.log(randomFact);
            console.log(healthArray);
            await interaction.channel.send(randomFact);
            await browser.close();
            console.log('Im out');

        })();
        await interaction.reply('Scraping ...');
    },
};
