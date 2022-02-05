const Discord = require("discord.js");
const client = new Discord.Client({intents:32767});
const fs = require("fs");

const data = require("all.db");
const db = new data();

const colors = require("./util/log.js");
const log = (message,color) =>  colors.log(message,color);
const betterLog = (message) =>  colors.betterLog(message);

const token = "TOKEN";
client.conf = {
  prefix: "!",
  owner: ["OWNER ID"]
}

client.on("ready", () => {
    log("Opened","cyan")
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

client.on("messageCreate", async (message) =>{
  let access = db.get("access");
  let channel = db.get("channel");
  if(message.author.bot) return;
  if(!access || !channel) return;
  if(!access.includes(message.author.id)) return;
  if(message.channel.id != channel) return;
  let content = message.content;
  if(content.startsWith("```") && content.endsWith("```")){
    let cont = message.content.slice(3,-(message.content.toString().length-6));
    content = message.content.slice(3+cont.length,-3);
  }
  let rndm = getRandomInt(1000000000);
  const row = new Discord.MessageActionRow();
  row.addComponents(new Discord.MessageButton().setCustomId(`deleted_`+rndm).setLabel('❌').setStyle(4));
  try {
      console.log = function(value)
      {
          return value;
      };
      var evaled = await eval(content);
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      if(evaled.includes(token.slice(0,5)) || evaled.includes(token)) evaled = `\nUwU Token`;

          let embed = new Discord.MessageEmbed().addFields({ name: '**Output: 1**', value: `\`\`\`js\n${evaled.substring(0,1000)}\`\`\``, inline: false })

          if(evaled.length >= 1024){
            row.addComponents(new Discord.MessageButton().setCustomId(`backward_`+rndm).setLabel('◀️').setStyle(3))
            row.addComponents(new Discord.MessageButton().setCustomId(`forward_`+rndm).setLabel('▶️').setStyle(3))
          }
          return message.channel.send({embeds:[embed], components:[row]}).then(msga =>{

            const collector = msga.createMessageComponentCollector({ componentType: 'BUTTON', time: 30000 });
            let page=0;
            let pgs = Math.floor(evaled.length/1000|0);
            collector.on('collect', async i => {
              if (i.user.id === message.author.id && i.customId == "deleted_"+rndm) {
                i.deferUpdate();
                  msga.delete().catch(a => {});
                  message.delete().catch(a => {});
              }
              if (i.user.id === message.author.id && i.customId == "backward_"+rndm) {
                i.deferUpdate();
                if(page==0)return;
                page = page-1;
                let emb = new Discord.MessageEmbed().addFields({ name: '**Output: **'+ (page+1), value: `\`\`\`js\n${evaled.substring(page*1000,(page+1)*1000)}\`\`\``, inline: false })
                  
                msga.edit({embeds:[emb]}).catch(a => {});
              }
              if (i.user.id === message.author.id && i.customId == "forward_"+rndm) {
                i.deferUpdate();
                if(page == pgs) return;
                page = page+1;
                let emb = new Discord.MessageEmbed().addFields({ name: '**Output: **'+ (page+1), value: `\`\`\`js\n${evaled.substring(page*1000,(page+1)*1000)}\`\`\``, inline: false })
                
                msga.edit({embeds:[emb]}).catch(a => {});
              };
            });
          });
  } catch (err) {
    message.channel.send({content:`\`Error\` \`\`\`xl\n${clean(err)}\n\`\`\``, components:[row]}).then(msga =>{
      const collector = msga.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });
      collector.on('collect', async i => {
        if (i.user.id === message.author.id && i.customId == "deleted_"+rndm) {
          i.deferUpdate();
          msga.delete().catch(a => {});
          message.delete().catch(a => {});
        }else return;
      });
    });
  }



  function clean(text) {
      if (typeof(text) === "string")
          return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
          return text;
  }
});

client.on("messageCreate", (message) =>{
    if (message.author.bot) return;
    if (!message.content.startsWith(client.conf.prefix)) return;
    let command = message.content.split(" ")[0].slice(client.conf.prefix.length);
    let params = message.content.split(" ").slice(1);
    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
        if(cmd.conf.enabled == false) return;
        cmd.run(client, message, params);
    }
})

  client.commands = new Discord.Collection();
  client.aliases = new Discord.Collection();
  fs.readdir("./commands/", (err, files) => {
    
     if (err) console.error(err);
     log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓","yellow");
     files.forEach(fs => {
       let props = require(`./commands/${fs}`);
       let bosluk = "";
       let msg = `${fs.replace(".js", "").slice(0, 15)} // Yüklendi`
       for (let i=msg.length; i< 27; i++){

            bosluk += " ";
       }
       betterLog(`@yellow┃ ${fs.replace(".js", "").slice(0, 15)}.js @cyan// @greenYüklendi ${bosluk}@yellow┃`);
       client.commands.set(props.conf.name, props);
       props.conf.aliases.forEach(alias => {
         client.aliases.set(alias, props.conf.name);
       });
      });
      log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛","yellow");
   });
   client.reload = (name,command) => {
    return new Promise((resolve, reject) => {
      try {
        delete require.cache[require.resolve(`./commands/${command}`)];
        let cmd = require(`./commands/${command}`);
        client.commands.delete(name);
        client.aliases.forEach((cmd, alias) => {
          if (cmd === command) client.aliases.delete(alias);
        });
        client.commands.set(name, cmd);
        cmd.conf.aliases.forEach(alias => {
          client.aliases.set(alias, cmd.conf.name);
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  };

client.login(token);
