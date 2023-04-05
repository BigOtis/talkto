// chatAPI.js
const fetchChatResponse = async (contact, messages) => {
  try {
    // Pass only the most recent 10 or fewer messages
    const recentMessages = messages.slice(-10);

    // Choose the API route based on the contact name
    const apiRoute = contact.name === "OtisFuse AI Helper" ? "/api/getHelper" : "/api/getChat";

    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact, messages: recentMessages }),
    });

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error fetching chat response:", error);
    return "Sorry, I've been having too many chats lately and need a break. Please try again later.";
  }
};

const fetchGreetings = async (name) => {
  // Fetch the greeting from the API
  const response = await fetch("/api/getGreeting", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();
  const message = data.message;
  // if the message contains the error message, return a default greeting
  if (message.includes("An error occurred")) {
    return undefined;
  }
  return data.message;
};

export { fetchChatResponse, fetchGreetings };