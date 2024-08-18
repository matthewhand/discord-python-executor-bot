import logger from '../logging/logger';
import constants from '../config/configurationManager';

export abstract class LLMInterface {
    constructor() {
        if (new.target === LLMInterface) {
            throw new Error('Abstract class LLMInterface cannot be instantiated directly.');
        }
        logger.debug('LLMInterface instantiated');
    }

    static getManager(): LLMInterface {
        logger.debug('getManager called');
        switch (constants.LLM_PROVIDER) {
            case 'OpenAI': {
                const { OpenAiManager } = require('../managers/OpenAiManager');
                return OpenAiManager.getInstance();
            }
            default:
                logger.error('Unsupported LLM Provider specified in constants: ' + constants.LLM_PROVIDER);
                throw new Error('Unsupported LLM Provider specified in constants: ' + constants.LLM_PROVIDER);
        }
    }

    abstract buildRequestBody(historyMessages: any[]): Promise<object>;

    abstract sendRequest(message: any, history?: any[]): Promise<any>;

    abstract isBusy(): boolean;

    requiresHistory(): boolean {
        logger.debug('requiresHistory called');
        return false;
    }
}