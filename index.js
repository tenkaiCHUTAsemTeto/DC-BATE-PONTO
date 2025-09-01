const Discord = require("discord.js");
const { Client, Intents, GatewayIntentBits, ActivityType, PermissionFlagsBits } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const config = require("./config.json");
const { QuickDB } = require('quick.db');
const db = new QuickDB(); // using default driver

client.login(config.token);


module.exports = client;
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.config = require("./config.json");
require("./handler")(client);
const { glob } = require("glob");
const { promisify } = require("util");

const globPromise = promisify(glob);

client.once("ready", () => {
    console.log("S2COMMUNITY")
})



client.on("interactionCreate", async (interaction) => {
    if (!interaction.guild) return;

    if (interaction.isCommand()) {

        const cmd = client.slashCommands.get(interaction.commandName);

        if (!cmd)
            return;

        const args = [];

        for (let option of interaction.options.data) {

            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }

        cmd.run(client, interaction, args);
    }

    if (interaction.isContextMenuCommand()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);

    }
});


// Sistema do /botconfig

  client.on("interactionCreate", async interaction => {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("alterar_username")) {
        const modal_bot_config_nome = new Discord.ModalBuilder()
          .setCustomId('modal_bot_config_nome')
          .setTitle(`Altere informações do bot abaixo.`)
        const nome_bot = new Discord.TextInputBuilder()
          .setCustomId('username_bot')
          .setLabel('Digite o nome do bot.')
          .setPlaceholder('Escreva o nome aqui.')
          .setStyle(Discord.TextInputStyle.Short)
  
        const firstActionRow = new Discord.ActionRowBuilder().addComponents(nome_bot);
        modal_bot_config_nome.addComponents(firstActionRow)
        await interaction.showModal(modal_bot_config_nome);
      }
    }
  
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("alterar_avatar")) {
        const modal_bot_config_avatar = new Discord.ModalBuilder()
          .setCustomId('modal_bot_config_avatar')
          .setTitle(`Altere informações do bot abaixo.`)
        const avatar_bot_modal = new Discord.TextInputBuilder()
          .setCustomId('bot_avatar')
          .setLabel('URL do avatar.')
          .setPlaceholder('URL aqui')
          .setStyle(Discord.TextInputStyle.Short)
        const SecondActionRow = new Discord.ActionRowBuilder().addComponents(avatar_bot_modal)
        modal_bot_config_avatar.addComponents(SecondActionRow)
        await interaction.showModal(modal_bot_config_avatar);
      }
    }
    //
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'modal_bot_config_nome') {
      const nome_bot = interaction.fields.getTextInputValue('username_bot');
  
      await interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("White")
            .setDescription(`**${interaction.user.tag},** Alterei o meu nome para:`)
            .addFields(
              {
                name: `\\🌟 Nome alterado para:`,
                value: `\`\`\`fix\n${nome_bot}\n\`\`\``,
              },
            )
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dinamyc: true }) })
        ]
      })
      interaction.client.user.setUsername(nome_bot)
    }
    //
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'modal_bot_config_avatar') {
      const avatar_bot = interaction.fields.getTextInputValue('bot_avatar');
  
      interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("White")
            .setDescription(`**${interaction.user.tag},** Alterei o meu avatar para:`)
            .setImage(avatar_bot)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dinamyc: true }) })
        ]
      })
      interaction.client.user.setAvatar(avatar_bot)
    }
  })

  process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception: " + err);
});
  
process.on("unhandledRejection", (reason, promise) => {
    console.log("[GRAVE] Rejeição possivelmente não tratada em: Promise ", promise, " motivo: ", reason.message);
});


// Sistema dos Status do bot

/*
Types:
0 = Jogando
2 = Ouvindo
3 = Assistindo
*/

client.on("ready", () => {

  const activities = [
    { name: `❤️ S2S2`, type: 3 }, 
    { name: `💻 Gerenciando ${client.channels.cache.size} Canais`, type: 0 },
    { name: `🖤 Tudo sobre a S2`, type: 2 },
  ];
  
  const status = [
    'dnd'
  ];
  
  let i = 0;
  setInterval(() => {
    if(i >= activities.length) i = 0
    client.user.setActivity(activities[i])
    i++;
  }, 10 * 500);
  
  let s = 0;
});


// sistema modal avaliação

client.on("interactionCreate", async(interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "painel") {
      if (!interaction.guild.channels.cache.get(await db.get(`canal_avaliação_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true })
      const modal = new Discord.ModalBuilder()
      .setCustomId("modal")
      .setTitle("*Avaliação*");

      const pergunta1 = new Discord.TextInputBuilder()
      .setCustomId("pergunta1") 
      .setLabel("De uma nota de 0/10 para seu atendimento") 
      .setMaxLength(30) 
      .setMinLength(5) 
      .setPlaceholder("Resposta aqui!") 
      .setRequired(true) 
      .setStyle(Discord.TextInputStyle.Short) 

      const pergunta2 = new Discord.TextInputBuilder()
      .setCustomId("pergunta2") 
      .setLabel("De uma nota de 0/10 para seu item") 
      .setMaxLength(30) 
      .setPlaceholder("Resposta aqui!") 
      .setStyle(Discord.TextInputStyle.Short) 
      .setRequired(true)

      const pergunta3 = new Discord.TextInputBuilder()
      .setCustomId("pergunta3") 
      .setLabel("O Que achou do seu atendimento e do item?") 
      .setPlaceholder("Resposta aqui!") 
      .setStyle(Discord.TextInputStyle.Paragraph) 
      .setRequired(true)

      modal.addComponents(
        new Discord.ActionRowBuilder().addComponents(pergunta1),
        new Discord.ActionRowBuilder().addComponents(pergunta2),
        new Discord.ActionRowBuilder().addComponents(pergunta3)
      )

      await interaction.showModal(modal)
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === "modal") {
      let resposta1 = interaction.fields.getTextInputValue("pergunta1")
      let resposta2 = interaction.fields.getTextInputValue("pergunta2")
      let resposta3 = interaction.fields.getTextInputValue("pergunta3")

      if (!resposta1) resposta1 = "Não informado."
      if (!resposta2) resposta2 = "Não informado."
      if (!resposta3) resposta3 = "Não informado."

      let embed = new Discord.EmbedBuilder()
      .setColor("Green")
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`*❤️ O usuário ${interaction.user} enviou sua avaliação abaixo:*`)
      .addFields(
        {
          name: `De uma nota de 0/10 para seu atendimento:`,
          value: ` \`${resposta1}\``,
          inline: false
        },
        {
          name: `De uma nota de 0/10 para seu item:`,
          value: ` \`${resposta2}\``,
          inline: false
        },
        {
          name: `O Que achou do seu atendimento e do item?:`,
          value: ` \`${resposta3}\``,
          inline: false
        }
      );

      interaction.reply({ content: `Olá **${interaction.user.username}**, sua avaliação foi enviada com sucesso!`, ephemeral: true})
      await interaction.guild.channels.cache.get(await db.get(`canal_avaliação_${interaction.guild.id}`)).send({ embeds: [embed] })
    }
  }
})


// sistema das logs por webhook

const webhookUrl = "";
const webhookClient = new Discord.WebhookClient({ url: webhookUrl });

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const args = interaction.options._hoistedOptions.map((option) => {
    return `${option.name}: ${option.value}`;
  });

  let logMessage = new Discord.EmbedBuilder()
  .setColor("Random")
  .setTitle("Log de Comandos:")
  .setDescription(`
  > ➡️ | Comando: ${interaction.commandName}
  
  > ➡️ | Usuario nome: ${interaction.user.tag}
  > ➡️ | Usuario ID: ${interaction.user.id}

  > ➡️ | Servidor nome: ${interaction.guild.name}
  > ➡️ | Servidor ID: ${interaction.guild.id}
  > ➡️ | Servidor Membros: ${interaction.guild.memberCount}

  > ➡️ | Bot nome: ${client.user.username}
  > ➡️ | Bot ID: ${client.user.id}
  > ➡️ | Bot ping: ${client.ws.ping}ms`)
  .setTimestamp()

  webhookClient.send({ embeds: [logMessage] });
});


// sistema de verificação de cargo

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "verificar") {
      let role_id = await db.get(`cargo_verificação_${interaction.guild.id}`);
      let role = interaction.guild.roles.cache.get(role_id);
      if (!role) return;
      interaction.member.roles.add(role.id)
      interaction.reply({ content: `<a:verificado:1116558523095064667>  **Parabéns** ***__${interaction.user.username}__***, **você foi verificado com o cargo** ***__${role}__***!`, ephemeral: true })
    }
  }
})


// sistema de cargo

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "painelrole") {
      let role_id = await db.get(`cargo_${interaction.guild.id}`);
      let role = interaction.guild.roles.cache.get(role_id);
      if (!role) return;
      interaction.member.roles.add(role.id)
      interaction.reply({ content: `<a:verificado:1116558523095064667>  **Parabéns** ***__${interaction.user.username}__***, **você recebeu o cargo** ***__${role}__***!`, ephemeral: true })
    }
  }
})


// Sistema bater ponto

const dc = require("discord.js");
const moment = require("moment");
let array = []
let nsei = []

client.on("interactionCreate", async (int) => {

  if (!int.isButton()) return;
    if (int.customId === "btE") {
      if(nsei.includes(int.user.id)) {
      const reply3 = new dc.EmbedBuilder()
      .setDescription(`<a:verificado_azulescuro:1116558529747230880>  **Você já possuí um ponto aberto.**  `)
      .setColor('#8B0000')
      client.channels.cache.get(config.logsponto);
      return await int.reply({ embeds: [reply3], ephemeral: true })    
      };
    
     nsei.push(int.user.id)

             
      const reply1 = new dc.EmbedBuilder()
      .setDescription(`<a:verificado_azulescuro:1116558529747230880> ${int.user}  Seu ponto foi **INICIADO** com sucesso. `)
      .setColor('#008000')


      
      int.reply({ embeds: [reply1], ephemeral: true })

      
      let array = [int.user.id]

      if(int.user.customId == "entrar") {
          array.push(int.user)
      } else if(int.user.customId == "sair") {
          array = array.filter(user => user.id != int.user.id)
      }

      let canalLogs = client.channels.cache.get(config.logsponto); 

      const tempo1 = `<t:${moment(int.createdTimestamp).unix()}>`

      const embedE = new dc.EmbedBuilder()
      .setTitle(`<a:verificado_azulescuro:1116558529747230880> **NOVO PONTO INICIADO**  \n\n <a:verificado_roxo:1116558515717279846>  INFORMAÇOES ABAIXO:`)
      .setThumbnail(int.user.displayAvatarURL({ dinamyc: true, size: 2048, format: 'png' }))
      .setDescription(`<a:alarm:1132855343496577104>  Horário de entrada: ${tempo1}\n<a:Red_Catzin:1116615778934984714> Membro: **${int.user.username} (${int.user.id})**`)
      .setColor('#008000')
      .setFooter({
      iconURL: int.guild.iconURL({ dynamic: true }),
      text: (`Pontos Staffs.`)
          })
      .setTimestamp()

      
      canalLogs.send({ embeds: [embedE]})

    }
  
    if(int.customId === "btS") {

      if(!nsei.includes(int.user.id)) {
        const reply3 = new dc.EmbedBuilder()
      .setDescription(`<:WakaOk:952823154177368074>  | Você não possui ponto **ABERTO.**`)
      .setColor('#8B0000')
      client.channels.cache.get(config.logsponto);
      return await int.reply({ embeds: [reply3], ephemeral: true }) 
      } 

      nsei = nsei.filter((el) => {
        return el != int.user.id
      })

      const tempo2 = `<t:${moment(int.createdTimestamp).unix()}>`
      let canalLogs = client.channels.cache.get(config.logsponto); //ID do canal que será enviada logs do bateponto

      const reply2 = new dc.EmbedBuilder()
      .setDescription(`<a:verificado_azulescuro:1116558529747230880>  ${int.user}  Seu ponto foi **FINALIZADO** com sucesso.`)
      .setColor('#8B0000')

      int.reply({ embeds: [reply2], ephemeral: true })

      const embedS = new dc.EmbedBuilder()
      .setTitle(`<a:verificado_laranja:1116558538068725841>   **PONTO FINALIZADO**\n\n <a:verificado_roxo:1116558515717279846>  INFORMAÇÕES ABAIXO:`)
      .setThumbnail(int.user.displayAvatarURL({ dinamyc: true, size: 2048, format: 'png' }))
      .setDescription(`<a:alarm:1132855343496577104>  Horário de saída: ${tempo2}\n<a:Red_Catzin:1116615778934984714>  Membro: **${int.user.username} (${int.user.id})**`)
      .setColor('#8B0000')
      .setFooter({
      iconURL: int.guild.iconURL({ dynamic: true }),
      text: (`Pontos Staffs.`)
          })
      .setTimestamp()

      canalLogs.send({ embeds: [embedS]})

    }
});


// Sistema dos Events

const fs = require('fs');

fs.readdir('./Events', (err, file) => {
  file.forEach(event => {
    require(`./Events/${event}`)
  })
})