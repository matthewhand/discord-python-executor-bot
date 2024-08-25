import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'fs';
import path from 'path';
import { Client, CommandInteraction } from 'discord.js';
interface CommandHandler {
    data: {
        toJSON: () => object;
        name: string;
    };
    execute: (interaction: CommandInteraction) => Promise<void>;
}
const commands: object[] = [];
const commandExecutors: Record<string, (interaction: CommandInteraction) => Promise<void>> = {};
const commandsPath = path.join(__dirname, '..', 'commands', 'slash');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    if (file.endsWith('.ts') && require.extensions['.ts']) {
        const command: CommandHandler = require(filePath).default;  // Adjust to use .default if needed for ts imports
        if (command.data && command.execute) {
            commands.push(command.data.toJSON());
            commandExecutors[command.data.name] = command.execute;
        } else {
            const log = debug('namespace');
            log('The command at ' + filePath + ' is missing a required "data" or "execute" property.');
        }
    } else if (file.endsWith('.js')) {
        const command: CommandHandler = require(filePath);
        if (command.data && command.execute) {
            commands.push(command.data.toJSON());
            commandExecutors[command.data.name] = command.execute;
        } else {
            const log = debug('namespace');
            log('The command at ' + filePath + ' is missing a required "data" or "execute" property.');
        }
    }
}
export const registerCommands = async (clientId: string, token: string, guildId: string): Promise<void> => {
    const rest = new REST({ version: '9' }).setToken(token);
    try {
        debug('Started refreshing ' + commands.length + ' application (/) commands.');
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
        debug('Successfully reloaded ' + (Array.isArray(data) ? data.length : 0) + ' application (/) commands.');
    } catch (error: any) {
        debug('Error registering commands:' + error);
        if (error.code === 50001) {
            debug('Missing Access: The bot does not have permissions to register slash commands in the guild.');
        } else if (error.code === 50013) {
            debug('Missing Permissions: The bot lacks necessary permissions to execute this operation.');
        }
    }
};
export const handleCommands = (client: Client): void => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        const commandExecutor = commandExecutors[interaction.commandName];
        if (commandExecutor) {
            try {
                await commandExecutor(interaction);
            } catch (error: any) {
                debug('Error executing command ' + interaction.commandName + ':'  error);
                await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
            }
        } else {
            const log = debug('namespace');
            log('No executor found for command ' + interaction.commandName);
        }
    });
};
