require('dotenv').config()
const { saveTextToDB, getIPCount, checkUser, updateUser } = require('../util/MongoUtils');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.API_KEY_VALUE,
});

const openai = new OpenAIApi(configuration);
const dailyLimit = 5;

// helper function to call OpenAI to generate an essay
const generateEssay = async (title, prompt) => {

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: `"Title: ${title}"\nPrompt: "${prompt}"\n\n Write a 5 paragraph essay based on the title and prompt:`}],
    });
  
    return completion.data.choices[0].message.content.trim();
  };

// API endpoint to generate an essay
exports.writeEssay = async (req, res) => {
  try{
    console.log(req.body);
    const { title, prompt, token } = req.body;
    console.log(`Title: ${title}, Prompt: ${prompt}, Token: ${token}`);

    let user = undefined;
    // if a token was provided, check if the user exists in our database
    if(token){
      user = await checkUser(token);
    }

    // check if the user has exceeded the daily limit
    const ipaddr = getClientIp(req);
    const freeCount = await getIPCount(ipaddr);
    if(freeCount >= dailyLimit){
      if(!user){
        res.json({ essay: "You have exceeded daily limit of free essays. Please try again tomorrow or login to get more essays." });
        return;
      }
      else if(user.essayCredits > 0){
        // deduct a credit from the user and continue on
        user.essayCredits--;
        await updateUser(user);
      }
      else{
        res.json({ essay: "You have exceeded daily limit of free essays and are out of essay tokens. Please consider purchasing more." });
        return;
      }
    }
    
    const result = await generateEssay(title, prompt);
    console.log(result);
    // save the result to GCloud if successful
    saveTextToDB(title, prompt, result, getClientIp(req));
    // return the resulting text to the client
    res.json({ essay: result });
  }
  catch(e){
    res.json({ essay: "An error occurred generating your essay. Please try again later." + e });
  }
};

// Function to parse client ip address from request
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};