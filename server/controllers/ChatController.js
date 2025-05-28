const { Configuration, OpenAIApi } = require("openai");
const { saveStatsToDB } = require("../util/Mongo"); 

const configuration = new Configuration({
  apiKey: process.env.API_KEY_VALUE,
});

const openai = new OpenAIApi(configuration);

// Helper function to call OpenAI to generate a chat response
const generateHelperResponse = async (messages) => {
  const lastMessage = messages[messages.length - 1].message;
  await moderateMessage(lastMessage);

  let tokens = 0;
  const truncatedMessages = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const messageTokens = message.message.length + 5;
    tokens += messageTokens;

    if (tokens <= 10000) {
      truncatedMessages.unshift(message);
    } else {
      break;
    }
  }

  const formattedMessages = truncatedMessages.map((msg) => {
    const role = msg.isUser ? "user" : "assistant";
    const content = msg.message;
    return { role, content };
  });

  const systemMessage = `Please provide information about the Otis-Fuse AI Chat website and its features. The website allows users to chat with fictional characters by typing any name they can imagine. Users can start new conversations by typing the desired name in the input field. The layout is mobile-friendly, with the contacts section hidden in a menu to maximize the messaging area. If you are asked to provide a list of names, Please provide a list of famous characters as suggestions for the user to chat with. For each character's name, wrap it in <name> tags, like this: <name>Character Name</name>`;
  await moderateMessage(systemMessage);

  formattedMessages.unshift({
    role: "system",
    content: systemMessage
  });

  const completion = await openai.createChatCompletion({
    model: "gpt-4.1-nano",
    messages: formattedMessages,
  });

  return completion.data.choices[0].message.content.trim();
};

const generateChatResponse = async (contact, messages) => {
  const lastMessage = messages[messages.length - 1].message;
  await moderateMessage(lastMessage, contact.name, contact.description);

  let tokens = 0;
  const truncatedMessages = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const messageTokens = message.message.length + 5;
    tokens += messageTokens;

    if (tokens <= 10000) {
        truncatedMessages.unshift(message);
      } else {
        break;
      }
    }

  const formattedMessages = truncatedMessages.map((msg) => {
    const role = msg.isUser ? "user" : "assistant";
    const content = msg.message;
    return { role, content };
  });

  let systemMessage = `The person you are chatting with is a fan of ${contact.name}. Pretend to be ${contact.name} and respond in character, drawing upon the knowledge you have about ${contact.name} to make the conversation engaging and realistic. Talk the same way ${contact.name} would talk copying any mannerisms, slang, or other characteristics that make ${contact.name} unique.`;
  if (contact.description) {
    systemMessage += ` ${contact.name} is ${contact.description}`;
  }
  await moderateMessage(systemMessage, contact.name, contact.description);

  formattedMessages.unshift({
    role: "system",
    content: systemMessage
  });

  const completion = await openai.createChatCompletion({
    model: "gpt-4.1-nano",
    messages: formattedMessages,
  });

  return completion.data.choices[0].message.content.trim();
};

exports.generateGreeting = async (req, res) => {
  try {
    const { name } = req.body;

    const systemMessage = `The person you are chatting with is a fan of ${name}. Pretend to be ${name} and respond in character, drawing upon the knowledge you have about ${name} to make the conversation engaging and realistic. \n        Talk the same way ${name} would talk copying any mannerisms, slang, or other characteristics that make ${name} unique. \n        Start by saying hello to the user in your own short way.`;
    await moderateMessage(systemMessage, name);

    const formattedMessages = [
      {
        role: "system",
        content: systemMessage,
      },
    ];

    const completion = await openai.createChatCompletion({
      model: "gpt-4.1-nano",
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

    let result = await generateChatResponse(contact, messages);

    // Clean up double name prefix if present
    if (result && contact && contact.name && result.startsWith(contact.name + ': ')) {
      result = result.slice(contact.name.length + 2);
    }

    res.json({ message: result });

    try {
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

    res.json({ message: result });

    try {
      saveStatsToDB(contact.name, getClientIp(req));
    } catch (e) {
      console.error("Error saving stats to database:", e);
    }
  } catch (e) {
    if (e.message === 'The message violates the terms of service.') {
      res.json({ message: e.message + ' Please try a different topic.' });
    } else {
      res.json({
        message:
          "An error occurred generating your chat response. Please try again later. " +
          e,
      });
    }
  }
};

const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

const moderateMessage = async (message, contactName, contactDescription) => {
  const itemsToCheck = [message, contactName, contactDescription].filter(item => item !== undefined && item !== null);
  const combinedInput = itemsToCheck.join(' ');

  if (combinedInput.length > 0) {
    const moderationResponse = await openai.createModeration({ input: combinedInput });
    if (moderationResponse.data.results && moderationResponse.data.results[0].flagged) {
      throw new Error('Your message content violates the terms of service.');
    }
  }
};
