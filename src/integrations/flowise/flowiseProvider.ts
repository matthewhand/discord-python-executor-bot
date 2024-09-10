import { ILlmProvider } from '@src/llm/interfaces/ILlmProvider';
import { IMessage } from '@src/message/interfaces/IMessage';
import flowiseConfig from '@integrations/flowise/interfaces/flowiseConfig';
import { FlowiseClient } from 'flowise-sdk';
import Debug from 'debug';
import axios from 'axios';

const debug = Debug('app:flowiseProvider');

const flowise = new FlowiseClient({ baseUrl: flowiseConfig.get('FLOWISE_API_ENDPOINT') });

async function getApiKey() {
  const apiKey = flowiseConfig.get('FLOWISE_API_KEY');
  if (!apiKey) throw new Error('Flowise API key is missing.');
  return apiKey;
}

/**
 * Generates a chat completion using the Flowise SDK.
 */
export const flowiseProvider: ILlmProvider = {
  supportsChatCompletion: () => true,
  supportsCompletion: () => true,

  generateChatCompletion: async (historyMessages: IMessage[]): Promise<string> => {
    const apiKey = await getApiKey();
    const chatflowId = flowiseConfig.get('FLOWISE_CONVERSATION_CHATFLOW_ID');

    if (!historyMessages.length) throw new Error('No message history provided.');

    const userMessage = historyMessages[historyMessages.length - 1].getText();
    debug('Using Flowise SDK for chat completion');

    try {
      const completion = await flowise.createPrediction({
        chatflowId,
        question: userMessage,
        apiKey,
        streaming: false,
      });

      const response = completion?.text || 'No response generated';
      debug('Flowise SDK response:', response);
      return response;
    } catch (sdkError) {
      debug('Flowise SDK failed:', sdkError);
      if (flowiseConfig.get('FLOWISE_ENABLE_FALLBACK')) {
        return await fallbackToHttpApi(userMessage, chatflowId, apiKey);
      }
      throw sdkError;
    }
  },

  generateCompletion: async (prompt: string): Promise<string> => {
    const apiKey = await getApiKey();
    const chatflowId = flowiseConfig.get('FLOWISE_COMPLETION_CHATFLOW_ID');

    debug('Using Flowise SDK for completion');

    try {
      const completion = await flowise.createPrediction({
        chatflowId,
        question: prompt,
        apiKey,
        streaming: false,
      });

      const response = completion?.text || 'No response generated';
      debug('Flowise SDK response:', response);
      return response;
    } catch (sdkError) {
      debug('Flowise SDK failed:', sdkError);
      if (flowiseConfig.get('FLOWISE_ENABLE_FALLBACK')) {
        return await fallbackToHttpApi(prompt, chatflowId, apiKey);
      }
      throw sdkError;
    }
  },
};

async function fallbackToHttpApi(question: string, chatflowId: string, apiKey: string) {
  const apiUrl = `${flowiseConfig.get('FLOWISE_API_ENDPOINT')}/chatflows/${chatflowId}`;
  debug(`Falling back to HTTP API at ${apiUrl}`);

  try {
    const response = await axios.post(
      apiUrl,
      { question },
      { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
    );

    if (response.data?.text) {
      return response.data.text;
    }

    throw new Error('No valid response from Flowise HTTP API.');
  } catch (httpError) {
    debug('Flowise HTTP API failed:', httpError);
    throw httpError;
  }
}
