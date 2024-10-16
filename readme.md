# AI-Chatbot

Detailed explanation for each step of the code:

## 1 - Importing libraries

Two libraries are imported:

- **openai** to interact with the OpenAI API
- **dotenv** to load environment variables from a `.env` file, where we'll save sensitive information like the API key.

```ts
import OpenAI from "openai";
import * as dotenv from "dotenv";
```

## 2 - `dotenv.config()`

This command loads the variables defined in the `.env` file into the environment system. For example, the `.env` file will contain the API key (_OPENAI_API_KEY_), which will be used later in the code.

```ts
// We load environment variables from a .env file
// This allows us to keep sensitive data, like API keys, outside of the source code
dotenv.config();
```

## 3 - OpenAI Initialization

We create an instance of the OpenAI object, passing the API key as a parameter. `process.env.OPENAI_API_KEY` gets the key from the `.env` file. This allows our code to authenticate and interact with OpenAI servers.

```ts
// We initialize the OpenAI instance with the API key
// The API key is stored in the OPENAI_API_KEY environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in your .env file
});
```

## 4 - `getChatbotResponse` Function

This function is asynchronous because it needs to make an external request to the OpenAI API, which can take time to respond. If something goes wrong during the API call (_like a network error or an issue with the API itself_), we catch the error with a `try/catch` and display it with `console.error`.

**`openai.chat.completions.create`**: This is the call to the OpenAI API. We pass it the model we want to use (_in this case "gpt-4o-mini-2024-07-18"_) and an array of messages. The messages include:

- A system-type message that sets the context. In this case, we tell the model it's a "_helpful assistant_".
- A user-type message that represents the user's input, i.e., the question or request the user makes to the chatbot.

**`completion.choices[0].message.content`**: The OpenAI API returns an object called **completion**, which contains an array called **choices**. Each choice represents a possible response generated by the model. We take the first response (`choices[0]`) and return its content (`message.content`), which is the chatbot's response.

```ts
// Function to get a response from the chatbot
async function getChatbotResponse(userInput: string) {
  try {
    // Call to the OpenAI API to generate a response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18", // The specific model you want to use
      messages: [
        // The "system" message defines the assistant's behavior
        { role: "system", content: "You are a helpful assistant." },

        // The "user" message is the input provided by the user
        { role: "user", content: userInput },
      ],
    });

    // We extract and return the response generated by the chatbot
    // The 'choices' array contains the possible responses, we select the first one
    return completion.choices[0].message.content;
  } catch (error) {
    // If there's an error, we log it and rethrow it
    console.error("Error during OpenAI API call:", error);
    throw error;
  }
}
```

## 5 - Usage

Here we're using an **IIFE** (_Immediately Invoked Function Expression_), which allows us to use the `async/await` syntax directly.

- **`userInput`**: We define a variable with the user's input, in this case a request to write a haiku about recursion in programming.
- **`getChatbotResponse`**: We call the function we created to get the response from the chatbot, passing it the user's input.
- **`console.log`**: Once we get the response, we print it to the console with console.log to see it.
