import { DiscordService } from '@src/integrations/discord/DiscordService';
import { SlackMessageProvider } from '@src/message/providers/SlackMessageProvider';
import Debug from 'debug';
import messageConfig from '@src/message/interfaces/messageConfig';

const debug = Debug('app:getMessageProvider');

/**
 * Get Message Provider
 *
 * Determines and returns the appropriate message provider based on the
 * configuration specified in the message configuration.
 *
 * @returns The instance of the configured message provider.
 * @throws An error if the provider is unsupported.
 */
export function getMessageProvider() {
  const provider = messageConfig.get('MESSAGE_PROVIDER');
  debug('Configured message provider:', provider);

  if (!provider) {
    throw new Error('MESSAGE_PROVIDER is not configured.');
  }

  switch (provider.toLowerCase()) {
    case 'discord':
      return DiscordService.getInstance();  // Singleton for Discord
    case 'slack':
      return new SlackMessageProvider();      // New instance for Slack
    default:
      throw new Error(`Unsupported message provider: ${provider}`);
  }
}
