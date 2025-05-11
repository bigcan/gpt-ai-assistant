import axios from 'axios';
import config from '../config/index.js';
import { handleFulfilled, handleRejected, handleRequest } from './utils/index.js';

export const ROLE_SYSTEM = 'system';
export const ROLE_AI = 'model';
export const ROLE_HUMAN = 'user';

export const FINISH_REASON_STOP = 'STOP';
export const FINISH_REASON_LENGTH = 'MAX_TOKENS';

export const MODEL_GEMINI_PRO = 'gemini-pro';
export const MODEL_GEMINI_PRO_VISION = 'gemini-pro-vision';

const client = axios.create({
  baseURL: config.GEMINI_BASE_URL,
  timeout: config.GEMINI_TIMEOUT,
  headers: {
    'Accept-Encoding': 'gzip, deflate, compress',
  },
});

client.interceptors.request.use(handleRequest);
client.interceptors.response.use(handleFulfilled, (err) => {
  if (err.response?.data?.error?.message) {
    err.message = err.response.data.error.message;
  }
  return handleRejected(err);
});

const hasImage = ({ messages }) => (
  messages.some(({ content }) => (
    Array.isArray(content) && content.some((item) => item.image_url)
  ))
);

const formatMessages = (messages) => {
  const formattedMessages = [];
  
  for (const message of messages) {
    if (message.role === ROLE_SYSTEM) {
      // Add system message as a user message with a special prefix
      formattedMessages.push({
        role: ROLE_HUMAN,
        parts: [{ text: `System: ${message.content}` }]
      });
    } else if (Array.isArray(message.content)) {
      // Handle multimodal content
      const parts = [];
      for (const item of message.content) {
        if (item.type === 'text') {
          parts.push({ text: item.text });
        } else if (item.type === 'image_url') {
          parts.push({
            inline_data: {
              mime_type: 'image/jpeg',
              data: item.image_url.url.replace(/^data:image\/[a-z]+;base64,/, '')
            }
          });
        }
      }
      formattedMessages.push({ role: message.role === ROLE_AI ? ROLE_AI : ROLE_HUMAN, parts });
    } else {
      // Handle text-only content
      formattedMessages.push({
        role: message.role === ROLE_AI ? ROLE_AI : ROLE_HUMAN,
        parts: [{ text: message.content }]
      });
    }
  }
  
  return formattedMessages;
};

const createChatCompletion = ({
  model = config.GEMINI_COMPLETION_MODEL,
  messages,
  temperature = config.GEMINI_COMPLETION_TEMPERATURE,
  maxTokens = config.GEMINI_COMPLETION_MAX_TOKENS,
}) => {
  const useVisionModel = hasImage({ messages });
  const formattedMessages = formatMessages(messages);
  
  const body = {
    contents: formattedMessages,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      topP: 0.95,
      topK: 40,
    },
  };

  const modelPath = useVisionModel ? MODEL_GEMINI_PRO_VISION : model;
  return client.post(`/${modelPath}:generateContent?key=${config.GEMINI_API_KEY}`, body);
};

const createImage = ({
  prompt,
  size = config.GEMINI_IMAGE_GENERATION_SIZE,
  quality = config.GEMINI_IMAGE_GENERATION_QUALITY,
  n = 1,
}) => {
  // Note: Gemini doesn't have a direct image generation API like DALL-E
  // This is a placeholder for future implementation or integration with another service
  throw new Error('Image generation is not supported with Gemini API');
};

export {
  createChatCompletion,
  createImage,
};