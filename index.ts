import OpenAI from "openai";
import * as dotenv from "dotenv";

// Load environment variables from a .env file
// This allows you to keep sensitive data like API keys outside the codebase
dotenv.config();

// Initialize the OpenAI instance with the API key
// The API key is stored in the environment variable OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in your .env file
});

// Function to get a response from the chatbot
async function getChatbotResponse(userInput: string) {
  try {
    // Call OpenAI's chat completions API to generate a response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18", // The specific model you want to use (gpt-4o-mini)
      messages: [
        // The system message defines the behavior of the assistant
        { role: "system", content: "You are a helpful assistant." },

        // The user message is the input from the user
        { role: "user", content: userInput },
      ],
    });

    // Extract and return the chatbot's response from the API result
    // The 'choices' array contains the possible completions, we're selecting the first one
    return completion.choices[0].message.content;
  } catch (error) {
    // If there's an error, log it and rethrow it
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

// Example usage of the chatbot function
// We're using an immediately invoked function expression (IIFE) to allow async/await
(async () => {
  const userInput = "Write a haiku about recursion in programming.";
  const chatbotResponse = await getChatbotResponse(userInput);

  // Log the chatbot's response to the console
  console.log("Chatbot response:", chatbotResponse);
})();
