import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const LoadEvents = async (client) => {
  const eventsPath = join(__dirname, '..', 'events');
  
  try {
    const eventFiles = await readdir(eventsPath);
    const jsFiles = eventFiles.filter(file => file.endsWith('.js'));

    for (const file of jsFiles) {
      const filePath = join(eventsPath, file);
      const fileUrl = new URL(`file://${filePath}`);
      const event = await import(fileUrl);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
      client.events.set(event.name, event);
    }
  } catch (error) {
    console.error('Error loading events:', error);
  }
};