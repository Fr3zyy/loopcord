import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botun gecikme süresini gösterir!');

export const execute = async (interaction) => {
    const sent = await interaction.reply({ content: 'Ping ölçülüyor...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`Pong! Bot gecikmesi: ${latency}ms. API Gecikmesi: ${interaction.client.ws.ping}ms`);
};