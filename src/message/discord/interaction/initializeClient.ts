import Debug from "debug";
const debug = Debug("app");

import { Client, GatewayIntentBits, Message } from 'discord.js';
import Debug from 'debug';

const debug = Debug('app:discord:initializeClient');

/**
 * Initializes and returns a new Discord client instance.
 * 
 * @returns {Client} The initialized Discord client.
 */
export function initializeClient(): Client {
    debug('Initializing Discord client with required intents.');
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates
        ],
    });

    client.once('ready', () => {
        debug('Discord client is ready and connected to the gateway!');
    });

    client.on('messageCreate', (message: Message) => {
        if (!message.guild) {
            debug('Ignoring direct message from user:', message.author.tag);
            return;  // Ignore direct messages
        }
        debug('Received a message in guild:', message.guild.name, 'with content:', message.content);
        // Additional message handling logic here
    });

    return client;
}
