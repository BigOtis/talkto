// chatAPI.js
const fetchChatResponse = async (contact, messages) => {
    try {
      // Pass only the most recent 10 or fewer messages
      const recentMessages = messages.slice(-10);
  
      const response = await fetch("/api/getChat", {
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
      return null;
    }
  };
  
  export default fetchChatResponse;