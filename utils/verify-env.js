/**
 * Environment Variable Verification Utility
 * 
 * This utility verifies that all required environment variables are set
 * and provides warnings for optional but recommended variables.
 */

import config from '../config/index.js';

// Define environment variable categories
const ENV_CATEGORIES = {
  REQUIRED: 'required',
  RECOMMENDED: 'recommended',
  OPTIONAL: 'optional'
};

// Define environment variables with their categories and validation rules
const ENV_VARS = {
  // App Configuration
  APP_ENV: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: 'production',
    description: 'Application environment (production, development, test)'
  },
  APP_DEBUG: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: 'false',
    description: 'Enable debug mode'
  },
  APP_URL: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: null,
    description: 'Application URL'
  },
  APP_PORT: { 
    category: ENV_CATEGORIES.RECOMMENDED, 
    defaultValue: null,
    description: 'Port to run the application on',
    validate: (value) => !isNaN(parseInt(value, 10))
  },
  APP_LANG: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: 'zh_TW',
    description: 'Default language',
    validate: (value) => ['zh_TW', 'zh_CN', 'en', 'ja'].includes(value)
  },
  APP_WEBHOOK_PATH: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: '/webhook',
    description: 'Webhook path for LINE integration'
  },
  APP_API_TIMEOUT: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: '9000',
    description: 'API timeout in milliseconds',
    validate: (value) => !isNaN(parseInt(value, 10))
  },
  APP_MAX_GROUPS: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: '1000',
    description: 'Maximum number of groups',
    validate: (value) => !isNaN(parseInt(value, 10))
  },
  APP_MAX_USERS: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: '1000',
    description: 'Maximum number of users',
    validate: (value) => !isNaN(parseInt(value, 10))
  },
  APP_MAX_PROMPT_MESSAGES: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: '4',
    description: 'Maximum number of prompt messages',
    validate: (value) => !isNaN(parseInt(value, 10))
  },
  APP_MAX_PROMPT_TOKENS: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: '256',
    description: 'Maximum number of prompt tokens',
    validate: (value) => !isNaN(parseInt(value, 10))
  },
  APP_INIT_PROMPT: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: '',
    description: 'Initial prompt for the AI'
  },
  
  // User/Bot Configuration
  HUMAN_NAME: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: '',
    description: 'Name for the human user'
  },
  HUMAN_INIT_PROMPT: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: '',
    description: 'Initial prompt for the human'
  },
  BOT_NAME: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: 'AI',
    description: 'Name for the AI bot'
  },
  BOT_INIT_PROMPT: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: '',
    description: 'Initial prompt for the bot'
  },
  BOT_TONE: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: '',
    description: 'Tone for the bot responses'
  },
  BOT_DEACTIVATED: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: 'false',
    description: 'Whether the bot is deactivated by default',
    validate: (value) => ['true', 'false'].includes(value)
  },
  ERROR_MESSAGE_DISABLED: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: 'false',
    description: 'Disable error messages',
    validate: (value) => ['true', 'false'].includes(value)
  },
  
  // Vercel Configuration (Optional)
  VERCEL_ENV: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: null,
    description: 'Vercel environment'
  },
  VERCEL_TIMEOUT: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: null,
    description: 'Vercel timeout',
    validate: (value) => !isNaN(parseInt(value, 10))
  },
  VERCEL_PROJECT_NAME: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: null,
    description: 'Vercel project name'
  },
  VERCEL_TEAM_ID: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: null,
    description: 'Vercel team ID'
  },
  VERCEL_ACCESS_TOKEN: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: null,
    description: 'Vercel access token'
  },
  VERCEL_DEPLOY_HOOK_URL: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: null,
    description: 'Vercel deploy hook URL',
    validate: (value) => value.startsWith('https://')
  },
  
  // LINE Configuration (Required for LINE integration)
  LINE_TIMEOUT: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: null,
    description: 'LINE API timeout',
    validate: (value) => !isNaN(parseInt(value, 10))
  },
  LINE_CHANNEL_ACCESS_TOKEN: { 
    category: ENV_CATEGORIES.REQUIRED, 
    description: 'LINE channel access token'
  },
  LINE_CHANNEL_SECRET: { 
    category: ENV_CATEGORIES.REQUIRED, 
    description: 'LINE channel secret'
  },
  
  // SerpAPI Configuration (Optional but recommended for search functionality)
  SERPAPI_TIMEOUT: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: null,
    description: 'SerpAPI timeout',
    validate: (value) => !isNaN(parseInt(value, 10))
  },
  SERPAPI_API_KEY: { 
    category: ENV_CATEGORIES.RECOMMENDED, 
    defaultValue: null,
    description: 'SerpAPI API key (required for search functionality)'
  },
  SERPAPI_LOCATION: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: 'tw',
    description: 'SerpAPI location'
  },
  
  // Gemini Configuration (Required)
  GEMINI_API_KEY: { 
    category: ENV_CATEGORIES.REQUIRED, 
    description: 'Google Gemini API key'
  },
  GEMINI_BASE_URL: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: 'https://generativelanguage.googleapis.com/v1/models',
    description: 'Google Gemini API base URL'
  },
  GEMINI_TIMEOUT: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: null,
    description: 'Google Gemini API timeout',
    validate: (value) => !isNaN(parseInt(value, 10))
  },
  GEMINI_COMPLETION_MODEL: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: 'gemini-pro',
    description: 'Google Gemini completion model',
    validate: (value) => ['gemini-pro', 'gemini-pro-vision'].includes(value)
  },
  GEMINI_COMPLETION_TEMPERATURE: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: '1',
    description: 'Google Gemini completion temperature',
    validate: (value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 1
  },
  GEMINI_COMPLETION_MAX_TOKENS: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: '64',
    description: 'Google Gemini completion max tokens',
    validate: (value) => !isNaN(parseInt(value, 10))
  },
  GEMINI_VISION_MODEL: { 
    category: ENV_CATEGORIES.OPTIONAL, 
    defaultValue: 'gemini-pro-vision',
    description: 'Google Gemini vision model',
    validate: (value) => ['gemini-pro-vision'].includes(value)
  }
};

/**
 * Verify environment variables
 * @returns {Object} Verification results
 */
const verifyEnv = () => {
  const results = {
    missing: [],
    invalid: [],
    warnings: [],
    allRequiredPresent: true
  };

  // Check each environment variable
  Object.entries(ENV_VARS).forEach(([key, details]) => {
    const value = process.env[key];
    const configValue = config[key];
    
    // Check if required variables are present
    if (details.category === ENV_CATEGORIES.REQUIRED && !configValue) {
      results.missing.push({
        key,
        description: details.description
      });
      results.allRequiredPresent = false;
    }
    
    // Check if recommended variables are present
    if (details.category === ENV_CATEGORIES.RECOMMENDED && !configValue) {
      results.warnings.push({
        key,
        description: details.description,
        type: 'missing_recommended'
      });
    }
    
    // Validate the value if a validation function is provided
    if (value && details.validate && !details.validate(value)) {
      results.invalid.push({
        key,
        value,
        description: details.description
      });
      
      // If a required variable is invalid, mark as not all required present
      if (details.category === ENV_CATEGORIES.REQUIRED) {
        results.allRequiredPresent = false;
      }
    }
  });

  return results;
};

/**
 * Print environment verification results
 * @param {Object} results Verification results
 */
const printEnvVerificationResults = (results) => {
  console.log('\n=== Environment Variable Verification ===\n');
  
  if (results.missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    results.missing.forEach(({ key, description }) => {
      console.error(`   - ${key}: ${description}`);
    });
    console.log('');
  }
  
  if (results.invalid.length > 0) {
    console.error('❌ Invalid environment variables:');
    results.invalid.forEach(({ key, value, description }) => {
      console.error(`   - ${key}: ${value} (${description})`);
    });
    console.log('');
  }
  
  if (results.warnings.length > 0) {
    console.warn('⚠️ Warnings:');
    results.warnings.forEach(({ key, description, type }) => {
      if (type === 'missing_recommended') {
        console.warn(`   - ${key}: Recommended but not set (${description})`);
      } else {
        console.warn(`   - ${key}: ${description}`);
      }
    });
    console.log('');
  }
  
  if (results.allRequiredPresent && results.invalid.length === 0) {
    console.log('✅ All required environment variables are set correctly.\n');
  }
  
  console.log('===========================================\n');
};

/**
 * Get a list of all environment variables with their categories
 * @returns {Object} Environment variables grouped by category
 */
const getEnvVarsList = () => {
  const grouped = {
    required: [],
    recommended: [],
    optional: []
  };
  
  Object.entries(ENV_VARS).forEach(([key, details]) => {
    grouped[details.category].push({
      key,
      description: details.description,
      defaultValue: details.defaultValue
    });
  });
  
  return grouped;
};

export {
  verifyEnv,
  printEnvVerificationResults,
  getEnvVarsList,
  ENV_CATEGORIES
};
