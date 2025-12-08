import OpenAI from "openai";

// This is using OpenAI's API, which points to OpenAI's API servers and requires your own API key.
// Reference: javascript_openai blueprint

// Validate API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error('WARNING: OPENAI_API_KEY environment variable is not set. Chat functionality will not work.');
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-development' 
});

export default openai;

// Using gpt-5-mini for optimal performance (2-3x faster than gpt-5, cost-efficient)
// User requested this change for better response times
export const CHAT_MODEL = "gpt-5-mini";
