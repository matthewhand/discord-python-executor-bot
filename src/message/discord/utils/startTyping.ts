import { Client, TextChannel, NewsChannel } from 'discord.js';
import logger from '@src/utils/logger';

export async function startTyping(client: Client, channelId: string): Promise<void> {
    try {
        logger.debug('[DiscordManager] Fetching channel ID: ' + channelId);
        const channel = await client.channels.fetch(channelId);
        logger.debug('[DiscordManager] Fetched channel: ' + (channel ? channel.id : 'null'));

        if (!channel) {
            logger.error('[DiscordManager] Channel with ID: ' + channelId + ' not found.');
            return;
        }

        logger.debug('[DiscordManager] Channel type: ' + channel.type);
        if (channel instanceof TextChannel || channel instanceof NewsChannel) {
            // TODO confirm permission before attempting to send
            // const permissions = channel.permissionsFor(client.user!);
            // if (!permissions || !permissions.has(PermissionsBitField.Flags.SEND_MESSAGES)) {
            //     logger.error('[DiscordManager] Missing SEND_MESSAGES permission in channel ID: ' + channelId);
            //     return;
            // }

            await channel.sendTyping();
            logger.debug('[DiscordManager] Started typing in channel ID: ' + channelId);
        } else {
            logger.debug('[DiscordManager] Channel ID: ' + channelId + ' does not support typing.');
        }
    } catch (error: any) {
        logger.error('[DiscordManager] Failed to start typing in channel ID: ' + channelId + ': ' + (error instanceof Error ? error.message : String(error)));
    }
}
