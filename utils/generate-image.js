import config from '../config/index.js';
import { MOCK_TEXT_OK } from '../constants/mock.js';
import { createImage } from '../services/gemini.js';

class Image {
  url;

  constructor({
    url,
  }) {
    this.url = url;
  }
}

/**
 * @param {Object} param
 * @param {string} param.prompt
 * @returns {Promise<Image>}
 */
const generateImage = async ({
  prompt,
}) => {
  if (config.APP_ENV !== 'production') return new Image({ url: MOCK_TEXT_OK });
  try {
    // Note: Gemini doesn't have a direct image generation API
    // This will throw an error as implemented in the gemini.js service
    const { data } = await createImage({ prompt });
    const [image] = data.data;
    return new Image(image);
  } catch (err) {
    // Return a placeholder or error message
    throw new Error('Image generation is not supported with Gemini API');
  }
};

export default generateImage;
