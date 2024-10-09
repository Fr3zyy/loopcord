import { SlashCommandBuilder, EmbedBuilder, version as discordJSVersion } from 'discord.js';
import mongoose from 'mongoose';
import os from 'os';
import { version as mongooseVersion } from 'mongoose';

export const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Display concise statistics about the bot and system');

export const execute = async (interaction) => {
    const client = interaction.client;
    
    const botUptime = formatUptime(client.uptime);
    const serverCount = client.guilds.cache.size;
    const userCount = client.users.cache.size;
    const systemUptime = formatUptime(os.uptime() * 1000);
    const memoryUsage = process.memoryUsage();
    const systemMemoryUsage = `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}/${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`;
    
    let dbStatus = '🔴 Offline';
    let dbPing = 'N/A';
    if (mongoose.connection.readyState === 1) {
        dbStatus = '🟢 Online';
        const start = Date.now();
        await mongoose.connection.db.admin().ping();
        dbPing = `${Date.now() - start}ms`;
    }

    const statsEmbed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('Bot Statistics')
        .setDescription(`\`\`\`asciidoc
= Bot Info =
• Uptime    :: ${botUptime}
• Servers   :: ${serverCount}
• Users     :: ${userCount}
• Discord.js:: v${discordJSVersion}
• Node.js   :: ${process.version}

= System Info =
• OS        :: ${os.type()} ${os.release()}
• Uptime    :: ${systemUptime}
• Memory    :: ${systemMemoryUsage}
• CPU       :: ${os.cpus()[0].model}

= Database =
• Status    :: ${dbStatus}
• Ping      :: ${dbPing}
• Version   :: v${mongooseVersion}

= Latency =
• Bot       :: ${Date.now() - interaction.createdTimestamp}ms
• API       :: ${Math.round(client.ws.ping)}ms
\`\`\``)
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp();

    await interaction.reply({ embeds: [statsEmbed] });
};

function formatUptime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}