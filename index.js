import { Client, GatewayIntentBits, Collection } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "./config.js";
import { ConnectDatabase } from "./src/Handlers/ConnectDatabase.js";
import { Logger } from "./src/Utils/Logger.js";
import { LoadCommands } from "./src/Handlers/LoadCommands.js";
import { LoadEvents } from "./src/Handlers/LoadEvents.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.logger = new Logger("info");
client.commands = new Collection();
client.events = new Collection();

const rest = new REST({ version: "9" }).setToken(config.bot.token);

async function registerSlashCommands() {
  try {
    client.logger.info("Loading slash commands...");
    const commands = Array.from(client.commands.values()).map((cmd) =>
      cmd.data.toJSON()
    );

    await rest.put(Routes.applicationCommands(config.bot.clientId), {
      body: commands,
    });

    client.logger.info("Slash commands loaded successfully!");
  } catch (error) {
    client.logger.error(
      "An error occurred while loading slash commands:",
      error
    );
  }
}

async function initializeBot() {
  try {
    await ConnectDatabase(config.database.uri);
    client.logger.info("Database connection successful.");

    await LoadCommands(client);
    await LoadEvents(client);

    await client.login(config.bot.token);
    client.logger.info("Bot logged in successfully.");

    await registerSlashCommands();
  } catch (error) {
    client.logger.error("An error occurred while initializing the bot:", error);
    process.exit(1);
  }
}

client.once("ready", () => {
  client.logger.info(`Bot logged in as ${client.user.tag}!`);
});

initializeBot();

export default client;
