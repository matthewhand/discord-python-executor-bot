import config from 'config';
import logger from '../../utils/logger';
import { getConfigOrWarn } from '@utils/configUtils';

class ConfigurationManager {
    // LLM Configuration
    public readonly LLM_API_KEY: string = process.env.LLM_API_KEY || 'default_api_key';
    public readonly LLM_ENDPOINT_URL: string = process.env.LLM_ENDPOINT_URL || 'default_endpoint_url';
    public readonly LLM_SYSTEM_PROMPT: string = getConfigOrWarn<string>('llm.systemPrompt', 'default_system_prompt');
    public readonly LLM_RESPONSE_MAX_TOKENS: number = getConfigOrWarn<number>('llm.responseMaxTokens', 100);
    public readonly LLM_TEMPERATURE: number = getConfigOrWarn<number>('llm.temperature', 0.7);
    public readonly LLM_MODEL: string = getConfigOrWarn<string>('llm.model', 'default_model');
    public readonly LLM_MESSAGE_LIMIT_PER_HOUR: number = getConfigOrWarn<number>('llm.messageLimitPerHour', 1000);
    public readonly LLM_MESSAGE_LIMIT_PER_DAY: number = getConfigOrWarn<number>('llm.messageLimitPerDay', 24000);
    public readonly LLM_PROVIDER: string = getConfigOrWarn<string>('llm.provider', 'default_provider');
    public readonly LLM_SUPPORTS_COMPLETIONS: boolean = getConfigOrWarn<boolean>('llm.supportsCompletions', true);
    public readonly LLM_STOP: string[] = getConfigOrWarn<string[]>('llm.stop', []);

    // Discord Configuration
    public readonly CLIENT_ID: string = getConfigOrWarn<string>('discord.clientId', 'default_client_id');
    public readonly BOT_USER_ID: string = getConfigOrWarn<string>('discord.botUserId', 'default_bot_user_id');
    public readonly WELCOME_MESSAGE: string = getConfigOrWarn<string>('discord.welcomeMessage', 'Welcome to the server!');
    public readonly VOICE_CHANNEL_ID: string = getConfigOrWarn<string>('discord.voiceChannelId', 'default_voice_channel_id');
    public readonly MAX_MESSAGE_LENGTH: number = getConfigOrWarn<number>('discord.maxMessageLength', 2000);
    public readonly INTER_PART_DELAY: number = getConfigOrWarn<number>('discord.interPartDelayMs', 1000);
    public readonly BOT_TYPING_DELAY_MAX_MS: number = getConfigOrWarn<number>('discord.typingDelayMaxMs', 5000);

    // Replicate Configuration
    public readonly REPLICATE_API_TOKEN: string = getConfigOrWarn<string>('replicate.apiToken', 'default_replicate_api_token');
    public readonly REPLICATE_API_URL: string = getConfigOrWarn<string>('replicate.apiUrl', 'https://api.replicate.com/v1');
    public readonly REPLICATE_MODEL_VERSION: string = getConfigOrWarn<string>('replicate.modelVersion', 'default_version');
    public readonly REPLICATE_WEBHOOK_URL: string = getConfigOrWarn<string>('replicate.webhookUrl', 'https://example.com/webhook');

    // Perplexity Configuration
    public readonly PERPLEXITY_API_URL: string = getConfigOrWarn<string>('perplexity.apiUrl', 'https://api.perplexity.ai/v1');

    // Narration Configuration
    public readonly NARRATION_ENDPOINT_URL: string = getConfigOrWarn<string>('narration.endpointUrl', 'https://api.narration.com/v1');
    public readonly NARRATION_API_KEY: string = getConfigOrWarn<string>('narration.apiKey', 'default_narration_api_key');

    // Transcription Configuration
    public readonly TRANSCRIBE_API_KEY: string = getConfigOrWarn<string>('transcribe.apiKey', 'default_transcribe_api_key');
}

export default new ConfigurationManager();