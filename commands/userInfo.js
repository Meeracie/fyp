const { SlashCommandBuilder, channelMention } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile2')
		.setDescription('Replies with Profile2'),
	async execute(interaction) {
		// await interaction.reply(`Hello, ${interaction.user.tag}`)
		const member = interaction.options.getMember('target');
		console.log("Member is ", interaction.member);
		const Response = new MessageEmbed()
		.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({dynamic: true}))
		.setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
		.setColor('NOT_QUITE_BLACK')
		.addField("UserID", interaction.user.id, false)
		.addField("Roles", `${interaction.member.roles.cache.map(r=>r).join(' ').replace("@everyone", " ")}`)
		.addField("Discord User Since", `${moment(interaction.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`)
		.addField("Server Member Since", `${moment(interaction.member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')}`)
		await interaction.reply({embeds: [Response]});
		
	},
};