# Imaginary Chat Application

This is an Imaginary Chat Application built using React and OpenAI API. It allows you to have a chat with any person you can imagine. You can create new conversations with personalities of your choice, and the application uses OpenAI API to generate the responses, simulating a chat experience with that person.

## Features

- Chat with any person you can imagine
- Dynamic contact list with the ability to add new conversations
- Uses OpenAI API to generate realistic chat responses
- Responsive design for various screen sizes

## Prerequisites

Before running this application, ensure you have [Node.js](https://nodejs.org/) installed on your system.

## Installation

Follow these steps to set up the Imaginary Chat Application:

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

Replace your_api_key_here with your actual OpenAI API key.
Running the application

5. Start the development server:


```
npm run server
```

This command will start the server required for the OpenAI API integration. Keep this terminal window open.

6. In a new terminal window, start the React development server:
```
npm start
```

This command will open the Imaginary Chat Application in your default web browser. The application should be running on http://localhost:3000/.

Now, you can start chatting with any person you can imagine! Add new conversations and interact with the generated responses from the OpenAI API. Enjoy your chat experience!
