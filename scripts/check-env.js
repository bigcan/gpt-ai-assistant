#!/usr/bin/env node

/**
 * Environment Variable Checker Script
 * 
 * This script checks if all required environment variables are set
 * and provides a comprehensive list of all environment variables
 * with their descriptions and default values.
 * 
 * Usage:
 * node scripts/check-env.js
 * 
 * Options:
 * --list-all: List all environment variables with their descriptions and default values
 * --list-required: List only required environment variables
 * --list-recommended: List only recommended environment variables
 * --check: Check if all required environment variables are set (default)
 * --generate-env: Generate a sample .env file with all environment variables
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyEnv, printEnvVerificationResults, getEnvVarsList, ENV_CATEGORIES } from '../utils/verify-env.js';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const listAll = args.includes('--list-all');
const listRequired = args.includes('--list-required');
const listRecommended = args.includes('--list-recommended');
const generateEnv = args.includes('--generate-env');
const check = args.includes('--check') || (!listAll && !listRequired && !listRecommended && !generateEnv);

// Get environment variables list
const envVarsList = getEnvVarsList();

// Function to print environment variables list
const printEnvVarsList = (category) => {
  const vars = envVarsList[category];
  
  if (vars.length === 0) {
    console.log(`No ${category} environment variables.`);
    return;
  }
  
  console.log(`\n${category.toUpperCase()} ENVIRONMENT VARIABLES:`);
  console.log('='.repeat(40));
  
  vars.forEach(({ key, description, defaultValue }) => {
    console.log(`${key}:`);
    console.log(`  Description: ${description}`);
    if (defaultValue !== undefined) {
      console.log(`  Default Value: ${defaultValue === null ? 'null' : `"${defaultValue}"`}`);
    }
    console.log('');
  });
};

// Function to generate a sample .env file
const generateEnvFile = () => {
  const envFilePath = path.join(__dirname, '..', '.env.sample');
  let envFileContent = '# Gemini AI Assistant - Sample Environment Variables\n';
  envFileContent += '# Generated on ' + new Date().toISOString() + '\n\n';
  
  // Add required variables
  envFileContent += '# Required Environment Variables\n';
  envFileContent += '# These must be set for the application to function properly\n';
  envVarsList.required.forEach(({ key, description }) => {
    envFileContent += `# ${description}\n${key}=\n\n`;
  });
  
  // Add recommended variables
  envFileContent += '# Recommended Environment Variables\n';
  envFileContent += '# These are not strictly required but are recommended for full functionality\n';
  envVarsList.recommended.forEach(({ key, description, defaultValue }) => {
    envFileContent += `# ${description}\n`;
    if (defaultValue !== null) {
      envFileContent += `${key}=${defaultValue}\n\n`;
    } else {
      envFileContent += `${key}=\n\n`;
    }
  });
  
  // Add optional variables
  envFileContent += '# Optional Environment Variables\n';
  envFileContent += '# These have default values and can be omitted\n';
  envVarsList.optional.forEach(({ key, description, defaultValue }) => {
    envFileContent += `# ${description}\n`;
    if (defaultValue !== null) {
      envFileContent += `${key}=${defaultValue}\n\n`;
    } else {
      envFileContent += `${key}=\n\n`;
    }
  });
  
  fs.writeFileSync(envFilePath, envFileContent);
  console.log(`Sample .env file generated at ${envFilePath}`);
};

// Main execution
if (check) {
  const results = verifyEnv();
  printEnvVerificationResults(results);
  
  // Exit with error code if required variables are missing
  if (!results.allRequiredPresent) {
    process.exit(1);
  }
}

if (listAll) {
  console.log('\nALL ENVIRONMENT VARIABLES:');
  console.log('='.repeat(40));
  printEnvVarsList(ENV_CATEGORIES.REQUIRED);
  printEnvVarsList(ENV_CATEGORIES.RECOMMENDED);
  printEnvVarsList(ENV_CATEGORIES.OPTIONAL);
}

if (listRequired) {
  printEnvVarsList(ENV_CATEGORIES.REQUIRED);
}

if (listRecommended) {
  printEnvVarsList(ENV_CATEGORIES.RECOMMENDED);
}

if (generateEnv) {
  generateEnvFile();
}
