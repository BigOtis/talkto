const { Configuration, OpenAIApi } = require("openai");
const { saveStatsToDB } = require("../util/Mongo"); 

const configuration = new Configuration({
  apiKey: process.env.API_KEY_VALUE,
});

const openai = new OpenAIApi(configuration);

// Helper function to call OpenAI to generate a chat response
const generateHelperResponse = async (messages) => {
  // Check the last message with the moderation API
  const lastMessage = messages[messages.length - 1].message;
  await moderateMessage(lastMessage);

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
    content: `Please provide information about the Otis-Fuse AI Chat website and its features. The website allows users to chat with fictional characters by typing any name they can imagine. Users can start new conversations by typing the desired name in the input field. The layout is mobile-friendly, with the contacts section hidden in a menu to maximize the messaging area. If you are asked to provide a list of names, Please provide a list of famous characters as suggestions for the user to chat with. For each character's name, wrap it in <name> tags, like this: <name>Character Name</name>`
  });

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: formattedMessages,
  });

  return completion.data.choices[0].message.content.trim();
};


const generateChatResponse = async (contact, messages) => {
  // First check the last message with the moderation API
  const lastMessage = messages[messages.length - 1].message;
  await moderateMessage(lastMessage, contact.name, contact.description);

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

  let systemMessage = `The person you are chatting with is a fan of ${contact.name}. Pretend to be ${contact.name} and respond in character, drawing upon the knowledge you have about ${contact.name} to make the conversation engaging and realistic. Talk the same way ${contact.name} would talk copying any mannerisms, slang, or other characteristics that make ${contact.name} unique.`;
  
  if (contact.description) {
    systemMessage += ` ${contact.name} is ${contact.description}`; // append the description to the system message
  }

  // Add a system message for the assistant to act like the contact
  formattedMessages.unshift({
    role: "system",
    content: systemMessage
  });

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: formattedMessages,
  });

  return completion.data.choices[0].message.content.trim();
};


exports.generateGreeting = async (req, res) => {
  try {
    const { name } = req.body;

    formattedMessages = [
      {
        role: "system",
        content: `The person you are chatting with is a fan of ${name}. Pretend to be ${name} and respond in character, drawing upon the knowledge you have about ${name} to make the conversation engaging and realistic. 
        Talk the same way ${name} would talk copying any mannerisms, slang, or other characteristics that make ${name} unique. 
        Start by saying hello to the user in your own short way.`,
      },
    ]

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: formattedMessages,
    });

    res.json({ message: completion.data.choices[0].message.content.trim() });
  } catch (e) {
    console.log(e);
    res.json({
      message:
        "An error occurred generating your chat response. Please try again later. " +
        e,
    });
  }
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

exports.getHelperMessage = async (req, res) => {
  try {
    const { contact, messages } = req.body;

    const result = await generateHelperResponse(messages);

    // Return the resulting text to the client
    res.json({ message: result });

    // Now that we have a response, save the stats to the database
    try{
      saveStatsToDB(contact.name, getClientIp(req));
    } catch (e) {
      console.error("Error saving stats to database:", e);
    }
  } catch (e) {
    if (e.message === 'The message violates the terms of service.') {
      res.json({ message: e.message + ' Please try a different topic.'});
    } 
    else {
      res.json({
        message:
          "An error occurred generating your chat response. Please try again later. " +
          e,
      });
    }
  }
};


// Function to parse client ip address from request
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

const moderateMessage = async (message, contactName, contactDescription) => {
  const itemsToCheck = [message, contactName, contactDescription];
  for (const item of itemsToCheck) {
    if (item !== undefined && item !== null) {
      const moderationResponse = await openai.createModeration({ input: item });
      if (moderationResponse.data.results && moderationResponse.data.results[0].flagged) {
        throw new Error('The content violates the terms of service.');
      }
    }
  }
};
