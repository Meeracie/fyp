const { SlashCommandBuilder, channelMention } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('myprofile')
		.setDescription('Replies with your profile'),
	async execute(interaction) {
		// await interaction.reply(`Hello, ${interaction.user.tag}`)
		const member = interaction.options.getMember('target');
		// const member = interaction.guild.members.cache.get(interaction.user.id);
		// console.log("Member is ", interaction.member);
		
		const botLatency = Date.now() - interaction.createdTimestamp;
        const ping = interaction.client.ws.ping;
		
		const Response = new MessageEmbed()
		.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({dynamic: true}))
		.setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
		.setColor("#5298e3")
		.addField("UserID", interaction.user.id, false)
		.addField("Roles", `${interaction.member.roles.cache.map(r => r).join(" ").replace("@everyone", "" || "")}`)
		.addField("Discord User Since", `${moment(interaction.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`)
		.addField("Server Member Since", `${moment(interaction.member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')}`)
		.addFields(
			{ name: "Latency🏓", value: `${botLatency}ms`, inline: true },
			{ name: "API Latency🏓", value: `${ping}ms`, inline: true },
		)
		await interaction.reply({embeds: [Response]});
		
	},
};