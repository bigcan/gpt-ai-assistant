import config from '../config/index.js';
import { MOCK_TEXT_OK } from '../constants/mock.js';
import { createChatCompletion, FINISH_REASON_STOP } from '../services/gemini.js';

class Completion {
  text;

  finishReason;

  constructor({
    text,
    finishReason,
  }) {
    this.text = text;
    this.finishReason = finishReason;
  }

  get isFinishReasonStop() {
    return this.finishReason === FINISH_REASON_STOP;
  }
}

/**
 * @param {Object} param
 * @param {Prompt} param.prompt
 * @returns {Promise<Completion>}
 */
const generateCompletion = async ({
  prompt,
}) => {
  if (config.APP_ENV !== 'production') return new Completion({ text: MOCK_TEXT_OK });
  const { data } = await createChatCompletion({ messages: prompt.messages });
  
  // Gemini API response structure is different from OpenAI
  const response = data.candidates[0];
  const content = response.content.parts[0].text.trim();
  
  return new Completion({
    text: content,
    finishReason: response.finishReason,
  });
};

export default generateCompletion;
