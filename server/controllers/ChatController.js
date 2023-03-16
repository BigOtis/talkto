const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi({
  api_key: process.env.OPENAI_API_KEY,
});

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
    content: `You are an AI assistant. The person you are chatting with is a fan of ${contact.name}. Respond as if you are ${contact.name}.`,
  });

  const completion = await openai.createCompletion({
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
  } catch (e) {
    res.json({
      message:
        "An error occurred generating your chat response. Please try again later. " +
        e,
    });
  }
};
