import React from "react";
import {
  MDBIcon,
  MDBInputGroup,
} from "mdb-react-ui-kit";
import Message from "./Message";
import Contact from "./Contact";
import { useState, useEffect, useRef } from "react";
import fetchChatResponse from "../../utils/chatAPI";
import { Spinner, Button, Image, Container, Row, Col } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import userAvatar from "../../img/avatar2.png";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import MediaQuery from "react-responsive";
import "./chat.css";

const Chat = () => {

    const toni = { avatar: "https://th.bing.com/th/id/OIG.SH7.u10w3N.sMfZ.6X8t?pid=ImgGn", name: "OtisFuse AI Helper", messages: [{"message": "Welcome to OtisFuse AI Chat, where you can talk to any character you can imagine. Just type any name you want to chat with in the new conversation area to create a new character to chat with. Let me know if you have any questions or if you want me to suggest some famous characters for you to chat with.", "time": "Now", "isUser": false}] }
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
    const sortedContacts = contacts.slice().sort((a, b) => new Date(b.messages[b.messages.length - 1].time) - new Date(a.messages[a.messages.length - 1].time));
    const [currentContact, setCurrentContact] = useState(localStorage.getItem("currentContact"));
    const [messageCount, setMessageCount] = useState(0);
    const [isFetchingResponse, setIsFetchingResponse] = useState(false);
    const [messageText, setMessageText] = useState("");


    // update local storage every time contacts or currentContact changes
    useEffect(() => {
      localStorage.setItem("contacts", JSON.stringify(contacts));
      localStorage.setItem("currentContact", currentContact);
      scrollToBottom();
    }, [contacts, currentContact, messageCount]);
    
    const handleContactClick = (sortedIndex) => {
      const selectedContact = sortedContacts[sortedIndex];
      const originalIndex = contacts.findIndex(contact => contact === selectedContact);
      setCurrentContact(originalIndex);
    };

    const handleNewConversation = async (event) => {
      if (event.keyCode === 13) {
        const name = event.target.value.trim();
        if (name) {
          const avatarUrl = await fetchImageUrl(name);
          const newContact = {
            avatar: avatarUrl || "https://via.placeholder.com/150",
            name: name,
            messages: [{"message": `Hello... you've reached ${name}.`, "time": "Now", "isUser": false}],
          };
          setContacts([...contacts, newContact]);
          setCurrentContact(contacts.length);
          event.target.value = "";
        }
      }
    };

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

      try {
        // Call the chat API to get a response from the assistant
        const response = await Promise.race([
          fetchChatResponse(contacts[currentContact], contacts[currentContact].messages),
          timeout(10000),
        ]);
    
        // Add the response to the messages array
        contacts[currentContact].messages.push({
          message: response,
          time: getDateTimeString(),
          isUser: false,
        });
    
        setContacts([...contacts]);
        setMessageCount(messageCount + 1);
        setIsFetchingResponse(false);
    
      } catch (error) {
        console.error("Error fetching chat response", error);
        setIsFetchingResponse(false);
    
        // Show an error message to the user
        contacts[currentContact].messages.push({
          message: "Sorry, I've been a little overloaded with messages. I'm taking a short break. Chat with me again soon!",
          time: getDateTimeString(),
          isUser: false,
        });
        setContacts([...contacts]);
        setMessageCount(messageCount + 1);
      }
    };

  const renderLoadingIndicator = () => {
    if (isFetchingResponse) {
      return (
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
    return null;
  };

  const contactRenderer = ({ index, style }) => {
    const person = sortedContacts[index];
    return (
      <div key={index} style={{ ...style }}>
        <Contact
          key={index}
          index={index}
          person={person}
          handleContactClick={handleContactClick}
        />
      </div>
    );
  };

  const timeout = (ms) => {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    );
  };  

  return (
    <Container fluid className="py-5"  style={{ border: '1px solid gray' }}>
      <Row>
        <Col xs={12}>
              <Row>
                <MediaQuery maxWidth={767}>
                  {(matches) =>
                    matches ? (
                      // Mobile layout
                      <>
                        <Col xs={12} className="mb-4 mb-md-0">
                        <div className="p-3">
                            <MDBInputGroup className="rounded mb-3">
                              <input
                                className="form-control rounded small-text-on-mobile"
                                placeholder="Type any name to start a conversation..."
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
                            <div
                              className="contacts-section"
                              style={{ height: "300px" }}
                            >
                              <AutoSizer>
                                {({ width }) => (
                                  <List
                                    width={width}
                                    height={300}
                                    itemCount={sortedContacts.length}
                                    itemSize={100}
                                    children={contactRenderer}
                                  />
                                )}
                              </AutoSizer>
                            </div>
                          </div>
                          <hr></hr>
                          <div
                            className="messages-section"
                            style={{
                              width: "100%",
                              height: "calc(100vh - 200px)",
                              overflowY: "auto",
                              paddingRight: "1rem",
                            }}
                        >
                            {contacts[currentContact].messages.map(
                              (msg, index) => (
                                <Message
                                  key={index}
                                  message={msg.message}
                                  person={contacts[currentContact]}
                                  isUser={msg.isUser}
                                  time={msg.time}
                                />
                              )
                            )}
                            <div ref={messagesEndRef} />
                          </div>
  
                          {renderLoadingIndicator()}
                          <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                            <Image
                              src={userAvatar}
                              roundedCircle
                              style={{
                                width: "50px",
                                height: "50px",
                                padding: "2px",
                                border: "1px solid #000",
                                marginRight: "5px",
                              }}
                            />
                            <input
                              type="text"
                              className="form-control form-control-lg small-text-on-mobile"
                              id="exampleFormControlInput2"
                              placeholder="Type message"
                              maxLength="200"
                              disabled={isFetchingResponse}
                              value={messageText}
                              onChange={(event) =>
                                setMessageText(event.target.value)
                              }
                              onKeyDown={(event) => {
                                if (
                                  !isFetchingResponse &&
                                  event.keyCode === 13
                                ) {
                                  handleSendMessage({
                                    target: { value: messageText },
                                  });
                                  setMessageText("");
                                }
                              }}
                            />
                          <Button
                            variant="dark"
                            className="btn btn-primary ms-2"
                            onClick={(event) => {
                              if (!isFetchingResponse) {
                                handleSendMessage({
                                  target: { value: messageText },
                                });
                                setMessageText("");
                              }
                            }}
                          >
                            <ArrowRight size={24} />
                          </Button>
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
                      </Col>
                    </>
                  ) : (
                    // Desktop layout
                    <>
                      <Col md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                        <div className="p-3">
                          <MDBInputGroup className="rounded mb-3">
                            <input
                              className="form-control rounded"
                              placeholder="Type any name to start..."
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
                          <div
                            className="contacts-section"
                            style={{ height: "calc(100vh - 300px)" }}
                          >
                            <AutoSizer>
                              {({ width, height }) => (
                                <List
                                  width={width}
                                  height={height}
                                  itemCount={sortedContacts.length}
                                  itemSize={100}
                                  children={contactRenderer}
                                />
                              )}
                            </AutoSizer>
                          </div>
                        </div>
                      </Col>
                      <Col md="6" lg="7" xl="8">
                      <div
  className="messages-section"
  style={{
    width: "100%",
    height: "calc(100vh - 200px)",
    overflowY: "auto",
                            paddingRight: "1rem",
  }}
>
                          {contacts[currentContact].messages.map(
                            (msg, index) => (
      <Message
        key={index}
        message={msg.message}
        person={contacts[currentContact]}
        isUser={msg.isUser}
        time={msg.time}
      />
                            )
                          )}
  <div ref={messagesEndRef} />
</div>
                        {renderLoadingIndicator()}
                        <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                          <Image
                            src={userAvatar}
                            roundedCircle
                            style={{
                              width: "50px",
                              height: "50px",
                              padding: "2px",
                              border: "1px solid #000",
                              marginRight: "5px",
                            }}
                          />
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="exampleFormControlInput2"
                            placeholder="Type message"
                            maxLength="200"
                            disabled={isFetchingResponse}
                            value={messageText}
                            onChange={(event) =>
                              setMessageText(event.target.value)
                            }
                            onKeyDown={(event) => {
                              if (
                                !isFetchingResponse &&
                                event.keyCode === 13
                              ) {
                                handleSendMessage({
                                  target: { value: messageText },
                                });
                                setMessageText("");
                              }
                            }}
                          />
                          <Button
                            variant="dark"
                            className="btn btn-primary ms-2"
                            onClick={(event) => {
                              if (!isFetchingResponse) {
                                handleSendMessage({
                                  target: { value: messageText },
                                });
                                setMessageText("");
                              }
                            }}
                          >
                            <ArrowRight size={24} />
                          </Button>
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
                      </Col>
                    </>
                  )
                }
              </MediaQuery>
            </Row>
      </Col>
    </Row>
  </Container>
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