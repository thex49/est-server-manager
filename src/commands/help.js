const Discord = require('discord.js')
exports.run = async (client, message, args) => {
  const invite = await client.generateInvite(8);
   const embed = new Discord.RichEmbed()
  .setColor('36393E')
  .setTitle('**Est help here**')
  .setDescription('Well, take:\n-settings\n\nAlso use: s!help for user stats module (can be disabled of time)\nInvite (remove ADMIN mark if want): '+invite)
  message.channel.send(embed)
}

