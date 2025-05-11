# Gemini AI Assistant

<div align="center">

[![license](https://img.shields.io/pypi/l/ansicolortags.svg)](LICENSE) [![Release](https://img.shields.io/github/release/bigcan/gpt-ai-assistant)](https://GitHub.com/bigcan/gpt-ai-assistant/releases/)

</div>

Gemini AI Assistant is an application that integrates Google's Gemini AI models with the LINE Messaging API, allowing you to create your own AI assistant accessible through the LINE mobile app. This project is a fork of the original GPT AI Assistant, with all OpenAI components removed and replaced with Google Gemini functionality.

## Features

- **Conversational AI**: Chat with Google's powerful Gemini Pro models
- **Multimodal Capabilities**: Send images and get AI responses using Gemini Pro Vision
- **Web Search Integration**: Get real-time information through SerpAPI integration
- **Multiple Commands**: Various utility commands for different AI interactions
- **Multilingual Support**: Supports English, Chinese, and Japanese

## News

- 2024-05-11: The `5.0` version now exclusively supports Google Gemini models. :fire:
- 2024-05-11: Completely migrated from OpenAI to Google Gemini API.

## Setup Requirements

- Google Gemini API key
- LINE Messaging API channel
- Node.js environment
- (Optional) SerpAPI key for web search functionality

## Environment Variables

### Required Environment Variables

These must be set for the application to function properly:

```
# LINE Configuration
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
LINE_CHANNEL_SECRET=your_line_channel_secret

# Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key
```

### Recommended Environment Variables

These are not strictly required but are recommended for full functionality:

```
# App Configuration
APP_PORT=3000

# Search Configuration
SERPAPI_API_KEY=your_serpapi_api_key
```

### Optional Environment Variables

There are many optional environment variables with sensible defaults. You can generate a sample `.env` file with all variables and their descriptions:

```bash
npm run generate-env
```

### Environment Variable Verification

The application includes built-in environment variable verification that runs at startup. It will:

1. Check if all required environment variables are set
2. Validate the format/values of certain variables
3. Provide warnings for recommended but missing variables

You can also run the verification manually:

```bash
# Check environment variables
npm run check-env

# List all required environment variables
npm run check-env:required

# List all environment variables
npm run check-env:all

# Generate a sample .env file
npm run generate-env
```

## Documentation

Documentation is currently being updated for the Gemini version. For reference, you can check the original project documentation:

- <a href="https://github.com/bigcan/gpt-ai-assistant/wiki" target="_blank">Wiki Documentation</a>

## Installation

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/bigcan/gpt-ai-assistant.git
   cd gemini-ai-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate a sample `.env` file:
   ```bash
   npm run generate-env
   ```

4. Edit the `.env.sample` file with your configuration and rename it to `.env`.

5. Verify your environment variables:
   ```bash
   npm run check-env
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/bigcan/gpt-ai-assistant.git
   cd gemini-ai-assistant
   ```

2. Generate a sample `.env` file:
   ```bash
   npm run generate-env
   ```

3. Edit the `.env.sample` file with your configuration and rename it to `.env`.

4. Verify your environment variables:
   ```bash
   npm run check-env
   ```

5. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

### Vercel Deployment

This application can also be deployed to Vercel. See the [Vercel documentation](https://vercel.com/docs) for more details.

## Available Commands

The assistant supports various commands, including:

- `/talk [message]` - Chat with the AI assistant
- `/search [query]` - Search the web and get AI-enhanced results
- `/forget` - Clear the conversation history
- `/continue` - Continue the previous response
- `/retry` - Regenerate the last response
- `/activate` - Activate the AI assistant
- `/deactivate` - Deactivate the AI assistant
- `/version` - Check the current version
- `/help` - Show available commands

## Limitations

- Image generation is not supported with Gemini API (unlike the original OpenAI version)
- Audio transcription is not available in this version

## Credits

- [Original GPT AI Assistant](https://github.com/memochou1993/gpt-ai-assistant) by [memochou1993](https://github.com/memochou1993)
- [jayer95](https://github.com/jayer95) - Debugging and testing
- [kkdai](https://github.com/kkdai) - Idea of `sum` command
- [Dayu0815](https://github.com/Dayu0815) - Idea of `search` command
- [All other contributors](https://github.com/bigcan/gpt-ai-assistant/graphs/contributors)

## Contact

If you have any questions or suggestions, please open an issue on GitHub.

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/bigcan/gpt-ai-assistant/releases).

## License

[MIT](LICENSE)
