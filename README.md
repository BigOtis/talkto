# OtisFuse - AI Chat

![image](https://github.com/user-attachments/assets/4df4078a-7d96-458b-b608-0b25c16bc5bb)

Live demo available: https://chat.otisfuse.com/

OtisFuse - AI Chat lets you chat with AI-generated personalities—famous, fictional, or anyone you can imagine. Enjoy entertaining, educational, and humorous conversations powered by advanced AI. Create new conversations with personalities of your choice, and the application uses the OpenAI API to generate responses, simulating a chat experience with that character.

## Features

- Chat with AI-generated versions of celebrities, historical figures, fictional characters, or anyone you can imagine
- Instantly create new conversations by typing any name
- Dynamic contact list with the ability to add new conversations
- Uses OpenAI API to generate realistic, engaging chat responses
- Responsive, mobile-friendly design
- Parody and entertainment focus—characters are fictional and for fun

## Legal Disclaimer

All characters on OtisFuse - AI Chat are AI-generated parodies for entertainment, humor, and educational purposes only. They do not represent real people, nor are they endorsed or affiliated with them. Please use the platform responsibly and see our About page for more details.

## Prerequisites

Before running this application, ensure you have [Node.js](https://nodejs.org/) installed on your system.

## Installation

Follow these steps to set up OtisFuse - AI Chat:

1. Clone the repository:

```
git clone https://github.com/BigOtis/talkto.git
cd talkto
```

2. Install the dependencies:

```
npm install
```

3. Set up the OpenAI API key:

4. Create a .env file in the root of the project directory, and add your OpenAI API key:

```
API_KEY_VALUE=your_api_key_here
```

Replace `your_api_key_here` with your actual OpenAI API key.

## Running the application

5. Start the server required for OpenAI API integration:

```
npm run server
```

Keep this terminal window open.

6. In a new terminal window, start the React development server:

```
npm start
```

This will open OtisFuse - AI Chat in your default web browser. The application should be running on http://localhost:3000/.

Now, you can start chatting with any AI-generated personality! Add new conversations and interact with the generated responses from the OpenAI API. Enjoy your chat experience!
