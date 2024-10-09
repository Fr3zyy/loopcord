import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import User from "../Schemas/User.js";
import { createPolicyEmbed } from "../Utils/Embeds/Policy.js";

const checkPolicy = async (interaction) => {
    const user = await User.findOne({ userID: interaction.user.id });
    if (user && user.policyAccepted) {
        return true;
    }

    const policyEmbed = createPolicyEmbed();
    const acceptButton = new ButtonBuilder()
        .setCustomId('accept_policy')
        .setLabel('Accept Policy')
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(acceptButton);

    await interaction.reply({
        content: "Before using any commands, you need to accept our policy.",
        embeds: [policyEmbed],
        components: [row],
        ephemeral: true,
    });

    try {
        const confirmation = await interaction.channel.awaitMessageComponent({
            filter: (i) => i.customId === "accept_policy" && i.user.id === interaction.user.id,
            time: 60000,
        });

        if (confirmation.customId === "accept_policy") {
            await User.findOneAndUpdate(
                { userID: interaction.user.id },
                { userID: interaction.user.id, policyAccepted: true, acceptedAt: new Date() },
                { upsert: true, new: true }
            );

            await confirmation.update({
                content: "You have accepted the policy. Thank you! Your command will now be executed.",
                components: [],
                embeds: [],
            });

            return true;
        }
    } catch (error) {
        await interaction.editReply({
            content: "Policy acceptance timed out. Please try the command again.",
            components: [],
            embeds: [],
        });
    }

    return false;
};

export const handleChatInputCommand = async (interaction) => {
    const { client } = interaction;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        client.logger.warn(`Command not found: ${interaction.commandName}`);
        await interaction.reply({
            content: "Sorry, this command was not found.",
            ephemeral: true,
        });
        return;
    }

    const policyAccepted = await checkPolicy(interaction);
    if (!policyAccepted) {
        return;
    }

    try {
        if (interaction.replied) {
            return;
        }
        await command.execute(interaction);
    } catch (error) {
        client.logger.error(
            `Error executing command ${interaction.commandName}:`,
            error
        );
        const errorMessage = "An error occurred while executing this command.";
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: errorMessage,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: errorMessage,
                ephemeral: true,
            });
        }
    }
};