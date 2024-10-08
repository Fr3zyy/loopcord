import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const LoadCommands = async (client) => {
  client.commands = new Map();
  const commandsPath = join(__dirname, '..', 'commands');
  
  try {
    const commandFiles = await readdir(commandsPath);
    const jsFiles = commandFiles.filter(file => file.endsWith('.js'));

    for (const file of jsFiles) {
      const filePath = join(commandsPath, file);
      const fileUrl = new URL(`file://${filePath}`);
      const command = await import(fileUrl);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      }
    }
  } catch (error) {
    console.error('Error loading commands:', error);
  }
};