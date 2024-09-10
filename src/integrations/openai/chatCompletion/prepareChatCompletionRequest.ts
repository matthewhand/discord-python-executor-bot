import { IMessage } from '@src/message/interfaces/IMessage';
import { OpenAI } from 'openai';
import { convertIMessageToChatParam } from './convertIMessageToChatParam';
import openaiConfig from '@integrations/openai/interfaces/openaiConfig';

/**
 * Prepares the request body for OpenAI's chat completion API.
 * Includes system messages, user input, and history messages.
 *
 * @param message - The user's message.
 * @param historyMessages - The conversation history.
 * @param systemMessageContent - A system message to initialize the chat.
 * @returns {OpenAI.Chat.ChatCompletionMessageParam[]}
 */
export function prepareChatCompletionRequest(
  message: string,
  historyMessages: IMessage[],
  systemMessageContent: string
): OpenAI.Chat.ChatCompletionMessageParam[] {
  const systemMessage: OpenAI.Chat.ChatCompletionMessageParam = {
    role: 'system',
    content: systemMessageContent,
    name: 'system',
  };

  // Handle user message and history
  const userMessage: OpenAI.Chat.ChatCompletionMessageParam = {
    role: 'user',
    content: message,
    name: 'default_user',
  };

  return [
    systemMessage,
    userMessage,
    ...historyMessages.map(convertIMessageToChatParam),
  ];
}

/**
 * Fetch OpenAI API configuration details like model, temperature, and max tokens.
 */
export function getOpenAIConfig(): { model: string; temperature: number; maxTokens: number } {
  const model = openaiConfig.get('OPENAI_MODEL') || 'gpt-3.5-turbo';
  const temperature = openaiConfig.get('OPENAI_TEMPERATURE') || 0.7;
  const maxTokens = openaiConfig.get('OPENAI_MAX_TOKENS') || 150;

  return { model, temperature, maxTokens };
}
