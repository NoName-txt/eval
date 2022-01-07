const Discord = require("discord.js");
const data = require("../util/db.js");
const db = new data();
function getMention(mention,symbol) {
	if (!mention) return;

	if (mention.startsWith('<'+symbol) && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return mention;
	}else{
        return mention;
    }
}

exports.run = (client, message, args, lang) =>  {
    if(message.author.id != client.owner) return;

    if(args[0] == "add") {
        let usr = getMention(args[1],"@")
        if(!usr) return message.channel.send("User Error").then(m => setTimeout(function(){m.delete()},5000));
        if(db.has("access")){
         if(!db.get("access").includes(usr)) db.push("access", usr);
        }else{
            db.push("access", usr);
        }
        message.delete();
        const emb = new Discord.MessageEmbed()
        .setDescription(`**Access Added** \n\n<@${usr}>`)
        .setFooter(message.author.tag,message.author.displayAvatarURL({dynamic:true}));
        return message.channel.send({ embeds: [emb] }).then(m => setTimeout(function(){m.delete()},5000));
    }
    else if(args[0] == "remove"){
        let usr = getMention(args[1],"@")
        if(!usr) return message.channel.send("User Error").then(m => setTimeout(function(){m.delete()},5000));
        db.pull("access", usr);
        message.delete();
        const emb = new Discord.MessageEmbed()
        .setDescription(`**Access Removed** \n\n<@${usr}>`)
        .setFooter(message.author.tag,message.author.displayAvatarURL({dynamic:true}));
        return message.channel.send({ embeds: [emb] }).then(m => setTimeout(function(){m.delete()},5000));
    }
    else if(args[0] == "channel"){
        let chn = getMention(args[1],"#")
        if(!chn) return message.channel.send("Channel Error").then(m => setTimeout(function(){m.delete()},5000));
        db.set("channel", chn)
        message.delete();
        const emb = new Discord.MessageEmbed()
        .setDescription(`**Channel Changed** \n\n<#${chn}>`)
        .setFooter(message.author.tag,message.author.displayAvatarURL({dynamic:true}));
        return message.channel.send({ embeds: [emb] }).then(m => setTimeout(function(){m.delete()},5000));
    }
};


exports.conf = {
    enabled: true,
    name: "access",
    aliases: []
};