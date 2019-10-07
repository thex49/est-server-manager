const datas = require('../../configs/ServerSettings');

const Discord = require('discord.js')
exports.run = (client, message, args) => {
  message.error = (ctx, embed) => {
    if (embed) {
      message.channel.send(`<:ErrorSquare:583632144165765121> \`${ctx}\``, {
        embed: embed
      });
    } else {
      message.channel.send(`<:ErrorSquare:583632144165765121> \`${ctx}\``)
    }
  }

  message.success = (ctx) => {
    message.channel.send(`<:GreenCheckMark:583632144077946882> \`${ctx}\``)
  }
  if (!message.member.hasPermission("MANAGE_GUILD")) return message.error('You need "MANAGE_GUILD" permissions to do this.')
  let action = args[0];
  args.shift();
  let path = args[0];
  args.shift();
  let setting = args[0];
  args.shift()
  let initialSetting = args[0];
  let initialArgs = args.slice(1).join(" ");

  /**
   * Settings file
   * @namespace
   */

  /*
   * Прошу никого ничего тут не менять (структура)!
   * Мельчайшое изменение как имени, так и логической структуры ведет к поломке.
   * В такой сложной системе как тут, это чаще всего приводит не к нахождению ошибки, а к ее обходу через добавление +50 строк.
   * Надеюсь на понимание всех, кто читает это с Atom teletype, или с GitHub
   * P.s: Все кто работают со мной в Atom teletype, можете не боятся за красоту кода, каждый раз когда я сохраняю файл через cntrl + S, файл автоматически проходит систему beatify.
   */
  const settings = datas[message.guild.id];
  if (!settings) {
    message.channel.send(`📥  | Cannot find server Configuration, would you install default?\n\`Yes\` | \`No\``)
    const collector = client.answer(message);
    collector.on('collect', message => {
      if (message.content.toLowerCase() === 'Yes'.toLowerCase()) {
        message.channel.send("<a:LoadingCircle:583632145306746880>` setting up server.`")
        datas[message.guild.id] = {
          autoRole: {
            active: true
          },
          serverStats: {
            active: true
          },
          logs: {
            active: true
          },
          welcome: {
            active: true
          },
          goodbye: {
            active: true
          },
          rooms: {
            active: true,
            rooms: {}
          },
          configEnabled: true
        }
        collector.stop();
        message.channel.send("<:GreenCheckMark:583632144077946882> Server setup success.")
      } else {
        message.channel.send("<:ErrorSquare:583632144165765121> `Cancel action`")
        collector.stop();
      }
    })
  } else {
    if (!action) {
      message.channel.send(new Discord.RichEmbed()
        .setDescription('Too much information, please, select setting with `-settings set {setting}`\n\n`autoRole`, `welcome`, `goodbye`, `serverStats`, `logs`, `autoMod`, `rooms`')
        .setColor('36393E'))
    } else {
      if (action === 'edit' && path === 'value') {
        message.channel.send(`<a:LoadingCircle:583632145306746880> \`Trying to update config value by user\``)
        try {
          datas[message.guild.id][setting] = args;
          message.channel.send(`<:GreenCheckMark:583632144077946882> \`Config is updated\`.`)
        } catch (err) {
          message.channel.send(`<:ErrorSquare:583632144165765121> \`Error ocurred, try again with another params.\``)
        }
      }


      if (action === 'disable') {
        if (!path) {
          const embed = new Discord.RichEmbed()
            .setColor('36393E')
            .setDescription('Aviable settings to disable:\n`autoRole`, `serverStats`, `welcome`, `goodbye`, `autoMod`, `logs`\n\nWrite: `-settings disable {setting}` to disable setting');
          message.error(`No setting provided.`, embed)
        } else {
          if ([`autoRole`, `serverStats`, `welcome`, `goodbye`, `autoMod`, `logs`].includes(path)) {
            message.success(`${path} was disabled.`);
            datas[message.guild.id][path].active = false;
          } else {
            const embed = new Discord.RichEmbed()
              .setColor('36393E')
              .setDescription('Aviable settings to disable:\n`autoRole`, `serverStats`, `welcome`, `goodbye`, `autoMod`, `logs`\n\nWrite: `-settings disable {setting}` to disable setting');
            message.error(`Wrong setting provided.`, embed)
          }
        }
      }
      if (action === 'enable') {
        if (!path) {
          const embed = new Discord.RichEmbed()
            .setColor('36393E')
            .setDescription('Aviable settings to enable:\n`autoRole`, `serverStats`, `welcome`, `goodbye`, `autoMod`, `logs`\n\nWrite: `-settings disable {setting}` to disable setting');
          message.error(`No setting provided.`, embed)
        } else {
          if ([`autoRole`, `serverStats`, `welcome`, `goodbye`, `autoMod`, `logs`].includes(path)) {
            message.success(`${path} was enabled.`);
            datas[message.guild.id][path].active = true;
          } else {
            const embed = new Discord.RichEmbed()
              .setColor('36393E')
              .setDescription('Aviable settings to enable:\n`autoRole`, `serverStats`, `welcome`, `goodbye`, `autoMod`, `logs`\n\nWrite: `-settings disable {setting}` to disable setting');
            message.error(`Wrong setting provided.`, embed)
          }
        }
      }
      if (action === 'show') {
        message.channel.send(`<a:LoadingCircle:583632145306746880> \`Mathing info..\``)
        if (!datas[message.guild.id][path]) return message.channel.send(`<:ErrorSquare:583632144165765121> \`Error ocurred, setting not found\``);
        message.channel.send(`<:GreenCheckMark:583632144077946882> Configuration for ${path}:\n\n\`\`\`json\n ${JSON.stringify(data[message.guild.id][path])}\`\`\``)
      }

      if (action === 'set') {
        if (path === 'logs') {
          if (!setting) {
            data = datas[message.guild.id].logs;
            const embed = new Discord.RichEmbed()
              .setColor('36393E')
              .setTitle('Logs settings')
              .addField('messageDelete', data.messageDelete ? '<:GreenCheckMark:583632144077946882>' : '<:ErrorSquare:583632144165765121>', true)
              .addField('messageUpdate', data.messageUpdate ? '<:GreenCheckMark:583632144077946882>' : '<:ErrorSquare:583632144165765121>', true)
              .addField('Main settings', `Active: ${data.active.toString()}\nLogs Channel: ${data.channel ? client.channels.get(data.channel).name : 'none'}`)
            message.channel.send(embed)
          } else {
            if (['disable', 'enable'].includes(setting)) {
              let event = args[0];
              if (setting === 'disable') {
                datas[message.guild.id].logs[event] = false;
                message.success(`${event} in now **disabled**`)
              } else {
                datas[message.guild.id].logs[event] = true;
                message.success(`${event} in now **enabled**`)
              }
            } else {
              message.error('Wrong setting.')
            }
          }
        }

        if (path === 'welcome') {
          if (!setting) {
            if (!datas[message.guild.id].welcome) {
              message.error('Cannot find settings');
            } else {
              data = datas[message.guild.id].welcome
              const embed = new Discord.RichEmbed()
                .setTitle('Welcome settings')
                .setColor('36393E') //Я даун. Я тоже
                .addField('Welcome channel', `${data.channel ? client.channels.get(data.channel).name : 'none'} (${data.channel ? data.channel : 'none'})`, true)
                .addField('Welcome text', `${data.message ? data.message : 'none'}`, true)
                .addField('Color', `${data.color ? data.color : 'none'}`, true)
                .addField('image', `${data.image ? data.image : 'none'}`, true)
                .addField('** **', `Setup welcome settings with \`channel\`, \`message\`, \`color\`, \`image\` setting`)
              message.channel.send(embed)
            }
          } else if (['message', 'image', 'channel', 'color'].includes(setting)) {
            if (setting === 'channel' && client.channels.get(args[1] === undefined)) return message.error('Cannot find channel with id: ' + args[0])
            datas[message.guild.id].welcome[setting] = args.join(' ')
            message.success(`welcome option ${setting} was update to ${args.join(' ')}`)
          } else {
            message.error('wrong setting.')
          }
        }
        if (path === 'goodbye') {
          if (!setting) {
            if (!datas[message.guild.id].goodbye) {
              message.error('Cannot find settings');
            } else {
              data = datas[message.guild.id].goodbye;
              const embed = new Discord.RichEmbed()
                .setTitle('Goodbye settings') //иди за мной в индекс
                .setColor('36393E')
                .addField('Goodbye channel', `${data.channel ? client.channels.get(data.channel).name : 'none'} (${data.channel ? data.channel : 'none'})`, true)
                .addField('Goodbye text', `${data.message ? data.message : 'none'}`, true)
                .addField('** **', `Setup goodbye settings with \`channel\`, \`message\`, \`color\`, \`image\` setting`)
              message.channel.send(embed)
            }
          } else if (['message', 'image', 'channel', 'color'].includes(setting)) {
            if (!args[0]) return message.error("No arguments provided")
            if (setting === 'channel' && client.channels.get(args[0] === undefined)) return message.error('Cannot find channel with id: ' + args[0])
            datas[message.guild.id].goodbye[setting] = args.join(" ");
            message.success(`goodbye option ${setting} was updated to ${args.join(" ")}`)
          } else {
            message.error('wrong setting.')
          }
        }

        if (path === 'autoRole') {
          if (!setting) {
            let data = datas;
            let embed = new Discord.RichEmbed()
              .setTitle('Autorole settings')
              .setColor('36393E')
              .addField(`Role to give`, `${data[message.guild.id].autoRole.id ? client.guilds.get(message.guild.id).roles.get(data[message.guild.id].autoRole.id).name : 'none'}`, true)
              .addField(`Role to give (ID)`, `${data[message.guild.id].autoRole.id ? data[message.guild.id].autoRole.id : 'none'}`, true)
              .addField(`Give timeout`, `${data[message.guild.id].autoRole.timeout ? data[message.guild.id].autoRole.timeout : 'none'}`, true)
              .addField(`** **`, 'Aviable settings:\n`role`, `timeout`\n\nUse `-settings set autoRole {setting} {arguments}`\nExample: `-settings set autoRole timeout 5000`')
              .setFooter(`Curently is ${data[message.guild.id].autoRole.active ? 'ENABLED' : 'DISABLED'}`)
            message.channel.send(embed)
          }

          if (setting === 'role') {
            console.log(setting)
            let role = message.guild.roles.get(initialSetting);
            if (role === undefined) return message.channel.send(`<:ErrorSquare:583632144165765121>  \`Cannot get role with id ${initialSetting}\``)
            message.channel.send(`<:GreenCheckMark:583632144077946882> **\`${role.name}\`** \`is now autorole.\``);
            datas[message.guild.id].autoRole.id = role.id;
            datas[message.guild.id].autoRole.timeout = 0;
          }

          if (setting === 'timeout') {
            console.log(setting)
            if (isNaN(args)) return message.channel.send(`<:ErrorSquare:583632144165765121>  \`This is not integer\``)
            message.channel.send(`<:GreenCheckMark:583632144077946882> **\`${args.join(" ")}\`** \`is new autorole timeout.\``);

            datas[message.guild.id].autoRole.timeout = args;
          }
        }

        if (path === 'rooms') {
          if (!datas[message.guild.id].rooms.category) {
            message.channel.send('📥  | It look, like you haven\'t rooms category, i can create it for you.\n`Yes` | `No`')
            const coll = client.answer(message);
            coll.on('collect', async message => {
              if (message.content === 'Yes') {
                coll.stop();
                message.channel.send(`<a:LoadingCircle:583632145306746880> \`Trying to create category\``)
                try {
                  message.guild.createChannel('Private room\'s', {
                    type: 'category', //оставляй названия каналов лучше на английском, их можно сменить через конфиг на русский юзером
                    position: 1
                  }).then(p => { //Тут уже если хочешь, можешь на русском либо на инглише
                    message.channel.send(`<:GreenCheckMark:583632144077946882> **\`Private room\'s +\`** \`has created.\``);
                    message.guild.createChannel('Create channel +', {
                      type: 'voice',
                      position: 1,
                      parent: p
                    }).then(channel => {
                      message.channel.send(`<:GreenCheckMark:583632144077946882> **\`Create channel +\`** \`has created\``);
                      message.channel.send(`<:GreenCheckMark:583632144077946882> \`Done!\``);
                      message.channel.send(`<a:LoadingCircle:583632145306746880> \`Writing data to bot.\``)
                      datas[message.guild.id].rooms = {
                        category: p.id,
                        channel: channel.id,
                        rooms: {}
                      };
                    }).catch(err => message.channel.send(`<:ErrorSquare:583632144165765121> \`Error ocurred, it look like i have no permissions.\`\n\n${err}`))
                  }).catch(err => message.channel.send(`<:ErrorSquare:583632144165765121> \`Error ocurred, it look like i have no permissions.\`\n\n${err}`))
                } catch (err) {
                  message.channel.send(`<:ErrorSquare:583632144165765121> \`Error ocurred, it look like i have no permissions.\`\n\n${err}`)
                }
              }
            })
          } else {
            try {
              const embed = new Discord.RichEmbed()
                .setColor("36393E")
                .setTitle("Server rooms settings [DISABLED BY OWNER]") //пока ничего не меняй, я запущу бота для проверки. Понял // тесты на сервере сада Понял
                .addField("Category", datas[message.guild.id].rooms.category ? `${client.channels.get(datas[message.guild.id].rooms.category).name} (${datas[message.guild.id].rooms.category})` : 'none')
                .addField("Channel", datas[message.guild.id].rooms.category ? `${client.channels.get(datas[message.guild.id].rooms.channel).name} (${datas[message.guild.id].rooms.channel})` : 'none')
              message.channel.send(embed);
            } catch (err) {
              return message.error(`Your server Configuration contains ERRORS, please send this message to the owner: \n${err}`)
            }
          }
        }


        if (path === 'serverStats') {
          if (!datas[message.guild.id].serverStats.category) {
            message.channel.send('📥  | It look, like you haven\'t stats category, i will create it for you\n`Yes` | `No`')
            const coll = client.answer(message);
            coll.on('collect', async message => {
              if (message.content === 'Yes') {
                coll.stop();
                message.channel.send(`<a:LoadingCircle:583632145306746880> \`Trying to create category\``)
                try {
                  message.guild.createChannel('SERVER STATS', {
                    type: 'category',
                    position: 1,
                    permissionOverwrites: [{
                      id: message.guild.id,
                      deny: ['CONNECT', 'SPEAK']
                    }]
                  }).then(p => {
                    message.channel.send(`<:GreenCheckMark:583632144077946882> **\`${p.name}\`** \`is created.\``);
                    message.channel.send(`<a:LoadingCircle:583632145306746880> \`Trying to create channels into parent\``)
                    message.guild.createChannel('Users\u2009\u2009count:\u2009\u2009 0', {
                      parent: p,
                      type: 'voice'
                    }).then(users => {
                      message.channel.send(`<:GreenCheckMark:583632144077946882> **\`Users count\`** \`was created.\``);
                      message.guild.createChannel('Bot\u2009\u2009count:\u2009\u2009 0', {
                        parent: p,
                        type: 'voice'
                      }).then(bots => {
                        message.channel.send(`<:GreenCheckMark:583632144077946882> **\`Bot count\`** \`was created.\``);
                        message.guild.createChannel('Channels\u2009\u2009count:\u2009\u2009 0', {
                          parent: p,
                          type: 'voice'
                        }).then(channels => {
                          message.channel.send(`<:GreenCheckMark:583632144077946882> **\`Channels count\`** \`was created.\``);
                          message.guild.createChannel('Roles\u2009\u2009count:\u2009\u2009 0', {
                            parent: p,
                            type: 'voice'
                          }).then(roles => {
                            message.channel.send(`<:GreenCheckMark:583632144077946882> **\`Voice online\`** \`was created.\``);
                            message.guild.createChannel('Voice online: 0', {
                              parent: p,
                              type: 'voice'
                            }).then(voice => {
                              message.channel.send(`<:GreenCheckMark:583632144077946882> **\`Roles count\`** \`was created.\``);
                              message.channel.send(`<:GreenCheckMark:583632144077946882> \`Done.\``);
                              message.channel.send(`<a:LoadingCircle:583632145306746880> \`Writing server data to bot..\``)
                              datas[message.guild.id].serverStats.category = {
                                id: p.id,
                                name: 'SERVER STATS'
                              };
                              datas[message.guild.id].serverStats.roles = {
                                id: roles.id,
                                name: 'Roles count: '
                              };
                              datas[message.guild.id].serverStats.bots = {
                                id: bots.id,
                                name: 'Bots count: '
                              };
                              datas[message.guild.id].serverStats.users = {
                                id: users.id,
                                name: 'Users count: '
                              };
                              datas[message.guild.id].serverStats.channels = {
                                id: channels.id,
                                name: 'Channels count: '
                              };
                              datas[message.guild.id].serverStats.voice = {
                                id: voice.id,
                                name: 'Voice online: '
                              };
                            }).catch(err => message.channel.send(`<:ErrorSquare:583632144165765121> \`Error ocurred, it look like i have no permissions.\`\n\n${err}`))
                          }).catch(err => message.channel.send(`<:ErrorSquare:583632144165765121> \`Error ocurred, it look like i have no permissions.\`\n\n${err}`))
                        }).catch(err => message.channel.send(`<:ErrorSquare:583632144165765121> \`Error ocurred, it look like i have no permissions.\`\n\n${err}`))
                      }).catch(err => message.channel.send(`<:ErrorSquare:583632144165765121> \`Error ocurred, it look like i have no permissions.\`\n\n${err}`))
                    }).catch(err => message.channel.send(`<:ErrorSquare:583632144165765121> \`Error ocurred, it look like i have no permissions.\`\n\n${err}`))

                  }).catch(err => message.channel.send(`<:ErrorSquare:583632144165765121> \`Error ocurred, it look like i have no permissions.\``))
                } catch (err) {
                  message.channel.send(`<:ErrorSquare:583632144165765121> \`Error ocurred, it look like i have no permissions.\`\n\n${err}`)
                }
              } else {
                message.channel.send(`<:ErrorSquare:583632144165765121> \`Cancel action.\``)
                coll.stop()
              }
            })
          } else {

            if (setting === 'delete') {
              message.channel.send('📤  | It will delete all stats in your server (bot data will be pruned)\n`Yes` | `No`')
              const coll = client.answer(message);
              coll.on('collect', async message => {
                if (message.content === 'Yes') {
                  coll.stop()
                  message.channel.send(`<a:LoadingCircle:583632145306746880> \`Trying to delete category and channels\``);
                  try {
                    client.channels.get(datas[message.guild.id].serverStats.channels.id).delete();
                    message.channel.send(`<:GreenCheckMark:583632144077946882> **\`Channels count\`** \`was deleted.\``);

                    client.channels.get(datas[message.guild.id].serverStats.users.id).delete();
                    message.channel.send(`<:GreenCheckMark:583632144077946882> **\`Users count\`** \`was deleted.\``);

                    client.channels.get(datas[message.guild.id].serverStats.bots.id).delete();
                    message.channel.send(`<:GreenCheckMark:583632144077946882> **\`Bots count\`** \`was deleted.\``);

                    client.channels.get(datas[message.guild.id].serverStats.roles.id).delete();
                    message.channel.send(`<:GreenCheckMark:583632144077946882> **\`Roles count\`** \`was deleted.\``);

                    client.channels.get(datas[message.guild.id].serverStats.voice.id).delete();
                    message.channel.send(`<:GreenCheckMark:583632144077946882> **\`Voice online\`** \`was deleted.\``);

                    client.channels.get(datas[message.guild.id].serverStats.category.id).delete();
                    message.channel.send(`<:GreenCheckMark:583632144077946882> **\`SERVER STATS\`** \`was deleted.\``);

                    message.channel.send(`<a:LoadingCircle:583632145306746880> \`Pruning data from the bot\``);
                    datas[message.guild.id].serverStats = {
                      active: true
                    }
                    message.channel.send(`<:GreenCheckMark:583632144077946882> \`Done.\``);
                  } catch (err) {
                    message.channel.send(`<:ErrorSquare:583632144165765121> \`Error ocurred, it look like i have no permissions, or channels already deleted.\``)
                  }
                } else {
                  message.channel.send(`<:ErrorSquare:583632144165765121> \`Cancel action.\``)
                  coll.stop()
                }
              })
            } else if (setting === 'name') {
              let channel = args[0];
              args.shift();
              let name = args.join(" ");

              if (['channels', 'users', 'voice', 'category', 'bots', 'roles'].includes(channel)) {
                message.channel.send(`<:GreenCheckMark:583632144077946882> Setting \`serverStats\` (name) Updated successfully\nChannel ${channel} now will be named \`${name+': ?'}\``)
                datas[message.guild.id].serverStats[channel].name = name + ': ';
              } else {
                message.channel.send(`<:ErrorSquare:583632144165765121> \`Invalid option\``)
              }
            } else {
              data = datas[message.guild.id].serverStats;
              const embed = new Discord.RichEmbed()
                .setColor('36393E')
                .setTitle('Server stats settings')
                .addField('Category', `Name: \`${data.category.name}\`\nID:\`${data.category.id}\``, true)
                .addField('Voice', `Name: \`${data.voice.name}\`\nID:\`${data.voice.id}\``, true)
                .addField('Users', `Name: \`${data.users.name}\`\nID:\`${data.users.id}\``, true)
                .addField('Bots', `Name: \`${data.bots.name}\`\nID:\`${data.bots.id}\``, true)
                .addField('Channels', `Name: \`${data.channels.name}\`\nID:\`${data.channels.id}\``, true)
                .addField('Roles', `Name: \`${data.roles.name}\`\nID:\`${data.roles.id}\``, true)
                .addField('** **', 'Aviable settings:\n`category`, `voice`, `users`, `channels`, `bots`, `roles`\n\nUse `-settings set serverSettings name {settings} {arguments}` to change names\n\nExample: `-settings set serverSettings name voice In the voice:`')
              message.channel.send(embed)
            }
          }
        }
      }
    }
  }
}
