import React from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTypography,
  MDBInputGroup,
} from "mdb-react-ui-kit";
import Message from "./Message";
import Contact from "./Contact";
import { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import fetchChatResponse from "../../utils/chatAPI";

const Chat = () => {  

    const me = { avatar: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp", name: "me" }
    const toni = { avatar: "https://images.gr-assets.com/authors/1494211316p8/3534.jpg", name: "Toni Morrison", messages: [{"message": "There is no time for despair, no place for self-pity, no need for silence, no room for fear. We speak, we write, we do language. That is how civilizations heal.", "time": "Now", "isUser": false}] }
    const messagesEndRef = useRef(null);
    
    // if local storage is undefined, initialize it
    if (localStorage.getItem("contacts") === null) {
        localStorage.setItem("contacts", JSON.stringify([toni]));
    }
    if (localStorage.getItem("currentContact") === null) {
        localStorage.setItem("currentContact", 0);
    }

    // load contacts and currentContact from local storage
    const [contacts, setContacts] = useState(JSON.parse(localStorage.getItem("contacts")));
    const [currentContact, setCurrentContact] = useState(localStorage.getItem("currentContact"));
    const [messageCount, setMessageCount] = useState(0);
    const [isFetchingResponse, setIsFetchingResponse] = useState(false);

    // update local storage every time contacts or currentContact changes
    useEffect(() => {
      localStorage.setItem("contacts", JSON.stringify(contacts));
      localStorage.setItem("currentContact", currentContact);;      
    }, [contacts, currentContact]);
    
    const handleContactClick = (index) => {
      setCurrentContact(index);
    };

    const handleNewConversation = async (event) => {
      if (event.keyCode === 13) {
        const name = event.target.value.trim();
        if (name) {
          const avatarUrl = await fetchImageUrl(name);
          const newContact = {
            avatar: avatarUrl || "https://via.placeholder.com/150",
            name: name,
            messages: [{"message": "Hello...", "time": "Now", "isUser": false}],
          };
          setContacts([...contacts, newContact]);
          setCurrentContact(contacts.length);
          event.target.value = "";
        }
      }
    };

    const msgRenderer = ({ index, style }) => {
      const msg = contacts[currentContact].messages[index];
      return (
        <div key={index} style={{ ...style }}>
          <Message key={index} message={msg.message} person={contacts[currentContact]} isUser={msg.isUser} time={msg.time} />
        </div>
      );
    };

    const handleSendMessage = async (event) => {
      const updatedContacts = [...contacts];
      // get the current contact and append our message to it's message list
      contacts[currentContact].messages.push({
        message: event.target.value,
        time: getDateTimeString(),
        isUser: true,
      });

      setContacts(updatedContacts);
      setMessageCount(messageCount + 1);
      
      // clear the input now that the message has been sent
      event.target.value = "";

      setIsFetchingResponse(true);

      // Call the chat API to get a response from the assistant
      const response = await fetchChatResponse(contacts[currentContact], contacts[currentContact].messages);

      if (response) {
        // Add the response to the messages array
        contacts[currentContact].messages.push({
          message: response,
          time: "Now",
          isUser: false,
        });

        setContacts(updatedContacts);
        setMessageCount(messageCount + 1);
        setIsFetchingResponse(false);

      } else {
        console.error("Error fetching chat response");
      }
  };
    
    return (
      <MDBContainer fluid className="py-5" style={{ backgroundColor: "#CDC4F9" }}>
        <MDBRow>
          <MDBCol md="12">
            <MDBCard id="chat3" style={{ borderRadius: "15px" }}>
              <MDBCardBody>
                <MDBRow>
                  <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                    <div className="p-3">
                      <MDBInputGroup className="rounded mb-3">
                        <input
                          className="form-control rounded"
                          placeholder="New Conversation"
                          type="search"
                          onKeyDown={handleNewConversation}
                        />
                        <span
                          className="input-group-text border-0"
                          id="search-addon"
                        >
                          <MDBIcon fas icon="search" />
                        </span>
                      </MDBInputGroup>

                      <MDBTypography listUnStyled className="mb-0">
                        {contacts.map((person, index) => (
                          <Contact
                            key={index}
                            index={index}
                            person={person}
                            handleContactClick={handleContactClick}
                          />
                        ))}
                      </MDBTypography>
                    </div>
                  </MDBCol>
                  <MDBCol md="6" lg="7" xl="8">
                  <div className="messages-section" style={{ width: "100%", height: "calc(100vh - 200px)" }}>
                    <AutoSizer>
                      {({ width, height }) => (
                        <List
                          width={width} // Adjust the width as needed
                          height={height} // Adjust the height as needed
                          itemCount={ contacts[currentContact].messages.length}
                          itemSize={100} // Adjust the height of each message row as needed
                          children={msgRenderer}
                        />     
                      )}     
                      </AutoSizer>
                    </div>

                    <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                        alt="avatar 3"
                        style={{ width: "40px", height: "100%" }}
                      />
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="exampleFormControlInput2"
                        placeholder="Type message"
                        maxLength="200"
                        disabled={isFetchingResponse}
                        onKeyDown={(event) => {
                          if (!isFetchingResponse && event.keyCode === 13) {
                            handleSendMessage(event);
                          }
                        }}
                      />
                      <a className="ms-1 text-muted" href="#!">
                    <MDBIcon fas icon="paperclip" />
                  </a>
                  <a className="ms-3 text-muted" href="#!">
                    <MDBIcon fas icon="smile" />
                  </a>
                  <a className="ms-3" href="#!">
                    <MDBIcon fas icon="paper-plane" />
                  </a>
                </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }

const fetchImageUrl = async (searchTerm) => {
  try {
    const response = await fetch("/api/getImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchTerm }),
    });

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Error fetching image URL:", error);
    return null;
  }
};
  
const getDateTimeString = () => {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  return `${date} ${time}`;
};

export default Chat;