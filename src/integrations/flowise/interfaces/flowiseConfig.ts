import convict from 'convict';

/**
 * Flowise-specific configuration using convict.
 * This handles the API keys, endpoint URLs, and chatflow IDs specific to Flowise integration.
 */
const flowiseConfig = convict({
    FLOWISE_API_KEY: {
        doc: 'API Key for Flowise integration',
        format: String,
        default: '',
        env: 'FLOWISE_API_KEY'
    },
    FLOWISE_API_ENDPOINT: {
        doc: 'Flowise API base URL',
        format: String,
        default: 'http://localhost:3002/api/v1',
        env: 'FLOWISE_API_ENDPOINT'
    },
    FLOWISE_CHATFLOW_ID: {
        doc: 'Flowise chatflow ID',
        format: String,
        default: '',
        env: 'FLOWISE_CHATFLOW_ID'
    }
});

// Enforce strict validation
flowiseConfig.validate({ allowed: 'strict' });

export default flowiseConfig;
