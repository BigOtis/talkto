const { Configuration, OpenAIApi } = require("openai");
const { saveStatsToDB } = require("../util/Mongo"); 

const configuration = new Configuration({
  apiKey: process.env.API_KEY_VALUE,
});

const openai = new OpenAIApi(configuration);

// Helper function to call OpenAI to generate a chat response
const generateChatResponse = async (contact, messages) => {
  // Truncate message list to fit within GPT's token limit of 2500 tokens
  let tokens = 0;
  const truncatedMessages = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const messageTokens = message.message.length + 5; // Add extra tokens for role, content, and formatting
    tokens += messageTokens;

    if (tokens <= 2500) {
      truncatedMessages.unshift(message);
    } else {
      break;
    }
  }

  // Format the messages for the prompt
  const formattedMessages = truncatedMessages.map((msg) => {
    const role = msg.isUser ? "user" : "assistant";
    const content = msg.message;
    return { role, content };
  });

  // Add a system message for the assistant to act like the contact
  formattedMessages.unshift({
    role: "system",
    content: `Remember, you're impersonating ${contact.name} in a playful, fictional manner. The person you are chatting with is a fan of ${contact.name}. Keep your responses short and in character, drawing upon the knowledge you have about ${contact.name} to make the conversation engaging and realistic. Maintain the persona throughout the conversation.`,
  });

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: formattedMessages,
  });

  return completion.data.choices[0].message.content.trim();
};

exports.getChatMessage = async (req, res) => {
  try {
    const { contact, messages } = req.body;

    const result = await generateChatResponse(contact, messages);

    // Return the resulting text to the client
    res.json({ message: result });

    // Now that we have a response, save the stats to the database
    try{
      saveStatsToDB(contact.name, getClientIp(req));
    } catch (e) {
      console.error("Error saving stats to database:", e);
    }
  } catch (e) {
    res.json({
      message:
        "An error occurred generating your chat response. Please try again later. " +
        e,
    });
  }
};

// Function to parse client ip address from request
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};


