var fs = require('fs')
const rp = require('request-promise');

const created = new Set();
const config = require('./configs/mainConfig.json');
const { token, prefix } = config;
const Discord = require('discord.js');
const blacklist = require('./configs/blacklist.json')
const client = new Discord.Client({
  disableEveryone: true
})
client.serverSettings = require('./configs/ServerSettings.json')
let settings = client.serverSettings;
//Section:::
client.cmdUses = {};

client.answer = function(message) {
  return new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });
}
//Section end.
let locate = (fullkey, obj) => {
  let keys = fullkey.split('.');
  let val = obj[keys.shift()];
  if (!val) return null;
  for (let key of keys) {
    if (!val[key]) return val;
    val = val[key];
    if (Array.isArray(val)) return val.join('\n');
  }
  return val || null;
};
const parse = (string, options = {}) => {
  if (!string) return string;
  return string.split(' ').map(str => (
    str.replace(/\{(.+)\}/gi, (matched, key) => (
      locate(key, options) || matched
    ))
  )).join(' ');
};


setInterval(() => {
  fs.writeFile('./configs/ServerSettings.json', JSON.stringify(client.serverSettings, null, 2), function() { })
}, 1000)


function log(pr, message) {
  if (!message) {
    message = pr;
    pr = 'Core'
  }
  return console.log(`${pr} :: ${message}`)
}
client.on('ready', process => {
  log(client.user.username + ' is ready.')
	client.user.setActivity('-help')

  setInterval(() => {
    let guild;
    for (guild in client.serverSettings) {
	console.log(guild)
      let g = client.guilds.get(guild);
      if (g === undefined) return;
      if (settings[guild].serverStats.active == false) { } else {
        if (!settings[guild].serverStats.roles) return;
        if (!settings[guild].serverStats.roles) { } else {
          client.channels.get(settings[guild].serverStats.roles.id).setName(`${settings[guild].serverStats.roles.name}${g.roles.size}`)
        }
        if (!settings[guild].serverStats.users) { } else {
          client.channels.get(settings[guild].serverStats.users.id).setName(`${settings[guild].serverStats.users.name}${g.memberCount}`)
        }
        if (!settings[guild].serverStats.channels) { } else {
          client.channels.get(settings[guild].serverStats.channels.id).setName(`${settings[guild].serverStats.channels.name}${g.channels.size}`)
        }
        if (!settings[guild].serverStats.bots) { } else {
          client.channels.get(settings[guild].serverStats.bots.id).setName(`${settings[guild].serverStats.bots.name}${g.members.filter(x => x.user.bot).size}`)
        }
        if (!settings[guild].serverStats.voice) { } else {
          let a = 0;
          g.channels.filter(x => x.type === 'voice').forEach(c => {
            a = a + c.members.size;
          })
          client.channels.get(settings[guild].serverStats.voice.id).setName(`${settings[guild].serverStats.voice.name}${a}`)
        }
      }
    }
  }, 10000)
});

client.on('guildMemberRemove', member => {
  if (!settings[member.guild.id]) return;
  if (!settings[member.guild.id].goodbye) return;
  if (!settings[member.guild.id].goodbye.message) return;
  if (!settings[member.guild.id].goodbye.channel) return;
  if (settings[member.guild.id].goodbye.active == false) {
    //ничего... ибо конфиг выключен сервером либо ты гей
  } else {
    const embed = new Discord.RichEmbed()
      .setTitle('Goodbye!')
      .setDescription(parse(settings[member.guild.id].goodbye.message, {
        username: member.user.username,
        tag: member.user.tag,
        mention: member.user,
        memberId: member.user.id,
        membersNow: member.guild.memberCount,
        guild: member.guild.name,
        guildId: member.guild.id
      }))
    if (settings[member.guild.id].goodbye.image) {
      embed.setImage(settings[member.guild.id].goodbye.image)
    }
    if (settings[member.guild.id].welcome.color) {
      embed.setColor(settings[member.guild.id].goodbye.color)
    } else {
      embed.setColor('RED')
    }
    member.guild.channels.get(settings[member.guild.id].goodbye.channel).send(embed)
  }
})/*
client.on('messageDelete', message => {
  if(!settings[message.guild.id]) return;
  if(!settings[message.guild.id].logs) return;
  if(settings[message.guild.id].logs.active == false) return;
  if(settings[message.guild.id].logs.messageDelete == false) return;
  if(message.author.bot === true) return;
  const embed = new Discord.RichEmbed()
  .setTitle(`Message deleted!`)
  .setColor(`36393E`)
  .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL)
  .setDescription(message.content)
  .addField(`** **`, `Channel: ${message.channel} (\`${message.channel.id}\`)\nAuthor: ${message.author} (up)`)
  client.channels.get(settings[message.guild.id].logs.channel).send(embed)
})

.on('messageUpdate',(oldMessage,message) => {
  if(message.author.bot === true) return;
  if(!settings[message.guild.id]) return;
  if(!settings[message.guild.id].logs) return;
  if(settings[message.guild.id].logs.active == false) return;
  if(!settings[message.guild.id].logs.messageUpdate) return;
  if(settings[message.guild.id].logs.messageUpdate == false) return;

  const embed = new Discord.RichEmbed()
  .setTitle('Message update!')
  .setColor(`36393E`)
  .setAuthor(message.author.tag +'('+message.author.id+')',message.author.displayAvatarURL)
  .setDescription(`Channel: ${message.channel} (\`${message.channel.id}\`)\nAuthor: ${message.author} (up)`)
  .addField('Old message', oldMessage.content)
  .addField('New message', message.content)
  client.channels.get(settings[message.guild.id].logs.channel).send(embed)
})
*/
client.on('guildMemberAdd', member => {
  if (!settings[member.guild.id]) return;
  if (!settings[member.guild.id].autoRole) return;
  if (settings[member.guild.id].autoRole.active == false) return;
  if (!settings[member.guild.id].autoRole.role) return;
  if (!settings[member.guild.id].autoRole.timeout) return;

  member.addRole(settings[member.guild.id].autoRole.role, 'AUTO ROLE');//делай messageUpdated ага
})
client.on('guildMemberAdd', member => {

  if (!settings[member.guild.id]) return;
  if (!settings[member.guild.id].welcome) return;
  if (!settings[member.guild.id].welcome.message) return;
  if (!settings[member.guild.id].welcome.channel) return;
  if (settings[member.guild.id].welcome.active == false) {
    //ничего... ибо конфиг выключен сервером либо ты гей
  } else {
    const embed = new Discord.RichEmbed()
      .setTitle('Welcome!')
      .setDescription(parse(settings[member.guild.id].welcome.message, {
        username: member.user.username,
        tag: member.user.tag,
        mention: member.user,
        memberId: member.user.id,
        membersNow: member.guild.memberCount,
        guild: member.guild.name,
        guildId: member.guild.id
      }))
    if (settings[member.guild.id].welcome.color) {
      embed.setColor(settings[member.guild.id].welcome.color)
    } else {
      embed.setColor("GREEN")
    }
    if (settings[member.guild.id].welcome.image) {
      embed.setImage(settings[member.guild.id].welcome.image)
    }
    member.guild.channels.get(settings[member.guild.id].welcome.channel).send(embed);
  }
})


client.on('message', message => {
  if (!message.author.bot !== true) return;
  if (!message.content.startsWith(prefix)) return;
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();
  log(`Trying to execute ${command} command.`)
  if(blacklist.users[message.author.id]) {
    return log(`Command execution STOPED :: USER WAS BLACKLISTED`)
  }
  if(blacklist.guilds[message.guild.id]) {
    return log(`Command execution STOPED :: GUILD WAS BLACKLISTED`)
  }
  try {
    let ex = Date.now();
    let commandFile = require(`./src/commands/${command}.js`);
    commandFile.run(client, message, args);
    client.cmdUses[command] = client.cmdUses[command] + 1 || 1;
    log(`Success, execution time took a ${Date.now() - ex}ms`);
    console.log(`__________________________________________`);
    console.info('');
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') return;
    console.error(err);
  }

})

  .on('voiceStateUpdate', (o, member) => {
    if(!settings[member.guild.id] || !settings[member.guild.id].rooms || !settings[member.guild.id].rooms.rooms) {
      for(room in settings[member.guild.id].rooms.rooms) {
        let ch = client.channels.get(room);
        if(ch === undefined) {
          delete settings[member.guild.id].rooms.rooms[room];
        } else {
          if(ch.members.size === 0) {
            ch.delete();
          }
        }
      }
    }
    try {

      if (!settings[member.guild.id] || !settings[member.guild.id].rooms.channel || !settings[member.guild.id].rooms.category) return;
      if (member.voiceChannelID === o.voiceChannelID) return;
      if (member.voiceChannelID !== settings[member.guild.id].rooms.channel || member.voiceChannel === null) {
        for (room in settings[member.guild.id].rooms.rooms) {
          console.log(room)
          roomC = client.channels.get(room);
          if (roomC === undefined && !settings[member.guild.id].rooms.rooms[room]) return;
          if (!settings[member.guild.id].rooms.rooms[room]) return roomC.delete();
          if (roomC.members.size === 0) {
            roomC.delete().then(r => {
              delete settings[member.guild.id].rooms.rooms[room]
            })
          }
        }
      }//устаревшая система, новую залью когда нибудь никогда.
      const category = settings[member.guild.id].rooms.category;
      const channel = settings[member.guild.id].rooms.channel;
      if (member.voiceChannelID === channel) {
        if (created.has(member.user.id)) {
          member.send(`Простите, но вы уже создавали свой личный канал, подождите 30 сек. после того, как создали прошлый\nЭто сделано ради защиты от флуда комнатами и понижения нагрузки на бота`).catch(err => {})
          let tr = settings[member.guild.id].rooms.rooms[o.voiceChannelID];
          if (tr === undefined) return;
          client.channels.get(o.voiceChannelID).delete();
          return;
        }
        console.log(member.user.username)
        if(created.has(member.user.id)) return member.send(`Простите, но вы уже создавали свой личный канал, подождите 30 сек. после того, как создали прошлый\nЭто сделано ради защиты от флуда комнатами и понижения нагрузки на бота`);
        member.guild.createChannel(`${member.user.username}`, { //
          parent: category,
          type: "voice",
          userLimit: 5
        }).then(c => {
          let id = c.id;
          console.log(id)
          member.setVoiceChannel(id)
          c.replacePermissionOverwrites({
            overwrites: [
              {
                 id: member.user.id,
                 allow: ['MANAGE_ROLES_OR_PERMISSIONS', 'MANAGE_CHANNELS'],
              },
            ],
              reason: 'Needed to change permissions'
            });
          settings[member.guild.id].rooms.rooms[id] = {
            owner: member.id,
            lock: false
          };
          created.add(member.user.id);
          setTimeout(() => {
            created.delete(member.user.id);
          }, 30000)
        })
      }
    } catch (err) {}
  })

client.login(token);

