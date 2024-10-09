import { EmbedBuilder } from "discord.js";

export const createPolicyEmbed = () => {
  return new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("LoopCord Usage Policy")
    .setDescription("Please read our bot usage policy carefully.")
    .addFields(
      {
        name: "1. Data Collection",
        value: "We collect minimal data necessary for bot functionality.",
      },
      {
        name: "2. User Responsibility",
        value: "Users are responsible for their interactions with the bot.",
      },
      {
        name: "3. Prohibited Actions",
        value: "Do not use the bot for spamming or any malicious activities.",
      },
      {
        name: "4. Privacy",
        value:
          "We respect your privacy and do not share your data with third parties.",
      },
      {
        name: "5. Terms Update",
        value: "We may update these terms. Check regularly for any changes.",
      }
    )
    .setFooter({ text: "By using this bot, you agree to these terms." });
};
