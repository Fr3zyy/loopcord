import { handleChatInputCommand } from "../Interactions/chatInputCommand.js";

export const name = "interactionCreate";
export const once = false;
export const execute = async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      await handleChatInputCommand(interaction);
    }
  } catch (error) {
    interaction.client.logger.error("Error in interaction handler:", error);
    const errorMessage = "An unexpected error occurred.";
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
