/**
 * ConfigurationManager
 *
 * Manages global configuration settings for the application.
 * This includes API-related constants, limits, and other configuration details.
 */

import Debug from 'debug';

const debug = Debug('app:ConfigurationManager');

class ConfigurationManager {
    // LLM Configuration
    public readonly LLM_API_KEY: string = process.env.LLM_API_KEY || 'default_api_key';
    public readonly LLM_ENDPOINT_URL: string = process.env.LLM_ENDPOINT_URL || 'default_endpoint_url';
    public readonly LLM_SYSTEM_PROMPT: string = this.getConfig<string>('llm.systemPrompt', 'default_system_prompt');
    public readonly LLM_MAX_TOKENS: number = this.getConfig<number>('llm.maxTokens', 150); // Added LLM_MAX_TOKENS
    public readonly LLM_TEMPERATURE: number = this.getConfig<number>('llm.temperature', 0.7);
    public readonly LLM_MODEL: string = this.getConfig<string>('llm.model', 'default_model');
    public readonly LLM_MESSAGE_LIMIT_PER_HOUR: number = this.getConfig<number>('llm.messageLimitPerHour', 1000);
    public readonly LLM_MESSAGE_LIMIT_PER_DAY: number = this.getConfig<number>('llm.messageLimitPerDay', 24000);
    public readonly LLM_PROVIDER: string = this.getConfig<string>('llm.provider', 'default_provider');
    public readonly LLM_SUPPORTS_COMPLETIONS: boolean = this.getConfig<boolean>('llm.supportsCompletions', true);
    public readonly LLM_STOP: string[] = this.getConfig<string[]>('llm.stop', []);
    public readonly LLM_TOP_P: number = this.getConfig<number>('llm.topP', 0.9);
    public readonly LLM_FREQUENCY_PENALTY: number = this.getConfig<number>('llm.frequencyPenalty', 0.1);
    public readonly LLM_PRESENCE_PENALTY: number = this.getConfig<number>('llm.presencePenalty', 0.05);
    public readonly INCLUDE_USERNAME_IN_COMPLETION: boolean = this.getConfig<boolean>('llm.includeUsernameInCompletion', false);
    public readonly INCLUDE_USERNAME_IN_CHAT_COMPLETION: boolean = this.getConfig<boolean>('llm.includeUsernameInChatCompletion', false);

    // Discord Configuration
    public readonly CLIENT_ID: string = this.getConfig<string>('discord.clientId', 'default_client_id');
    public readonly BOT_USER_ID: string = this.getConfig<string>('discord.botUserId', 'default_bot_user_id');
    public readonly WELCOME_MESSAGE: string = this.getConfig<string>('discord.welcomeMessage', 'Welcome to the server!');
    public readonly VOICE_CHANNEL_ID: string = this.getConfig<string>('discord.voiceChannelId', 'default_voice_channel_id');
    public readonly MAX_MESSAGE_LENGTH: number = this.getConfig<number>('discord.maxMessageLength', 2000);
    public readonly INTER_PART_DELAY: number = this.getConfig<number>('discord.interPartDelayMs', 1000);
    public readonly BOT_TYPING_DELAY_MAX_MS: number = this.getConfig<number>('discord.typingDelayMaxMs', 5000);

    // Replicate Configuration
    public readonly REPLICATE_API_TOKEN: string = this.getConfig<string>('replicate.apiToken', 'default_replicate_api_token');
    public readonly REPLICATE_API_URL: string = this.getConfig<string>('replicate.apiUrl', 'https://api.replicate.com/v1');
    public readonly REPLICATE_MODEL_VERSION: string = this.getConfig<string>('replicate.modelVersion', 'default_version');
    public readonly REPLICATE_WEBHOOK_URL: string = this.getConfig<string>('replicate.webhookUrl', 'https://example.com/webhook');

    // Perplexity Configuration
    public readonly PERPLEXITY_API_URL: string = this.getConfig<string>('perplexity.apiUrl', 'https://api.perplexity.ai/v1');

    // Narration Configuration
    public readonly NARRATION_ENDPOINT_URL: string = this.getConfig<string>('narration.endpointUrl', 'https://api.narration.com/v1');
    public readonly NARRATION_API_KEY: string = this.getConfig<string>('narration.apiKey', 'default_narration_api_key');

    // Transcription Configuration
    public readonly TRANSCRIBE_API_KEY: string = this.getConfig<string>('transcribe.apiKey', 'default_transcribe_api_key');

    // Follow-Up Configuration
    public readonly FOLLOW_UP_ENABLED: boolean = this.getConfig<boolean>('followUp.enabled', false);

    // Custom Configurations
    public readonly CHANNEL_ID: string = this.getConfig<string>('discord.channelId', 'default_channel_id');
    public readonly MIN_MESSAGE_INTERVAL_MS: number = this.getConfig<number>('message.minMessageIntervalMs', 1000);

    // New getConfig method wrapping around getConfigOrWarn
    public getConfig<T>(key: string, defaultValue: T): T {
        const value = process.env[key.toUpperCase().replace('.', '_')];
        if (value !== undefined) {
            return value as unknown as T;
        }
        debug('Warning: Configuration key not found: ' + key + '. Using default value: ' + defaultValue);
        return defaultValue;
    }
}

// Exporting ConfigurationManager as the default export
export default new ConfigurationManager();
