import React from "react";
import Message from "./Message";
import Contact from "./Contact";
import { useState, useEffect, useRef } from "react";
import fetchChatResponse from "../../utils/chatAPI";
import {
  Modal,
  Button,
  Container,
  Row,
  Col,
  Image,
  Spinner,
  Form,
  Dropdown,
  ButtonToolbar,
} from "react-bootstrap";
import {
  ArrowRight,
  PersonPlus,
  ChatSquareDotsFill,
  ThreeDotsVertical,
  Facebook,
  Twitter,
  BriefcaseFill,
  Instagram,
  Clipboard,
  Pinterest,
} from "react-bootstrap-icons";
import userAvatar from "../../img/avatar2.png";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import MediaQuery from "react-responsive";
import { useParams } from "react-router-dom";
import AboutInfo from "../AboutInfo";
import "./chat.css";

const Chat = () => {
  let { name } = useParams();

  const toni = {
    avatar: "https://th.bing.com/th/id/OIG.SH7.u10w3N.sMfZ.6X8t?pid=ImgGn",
    name: "OtisFuse AI Helper",
    messages: [
      {
        message:
          "Welcome to OtisFuse AI Chat, where you can talk to any character you can imagine. Just type any name you want to chat with in the new conversation area to create a new character to chat with. Let me know if you have any questions or if you want me to suggest some famous characters for you to chat with. Remember, all conversations are purely fictional in nature.",
        time: getDateTimeString(),
        isUser: false,
      },
    ],
  };
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  // if local storage is undefined, initialize it
  if (localStorage.getItem("contacts") === null) {
    localStorage.setItem("contacts", JSON.stringify([toni]));
  }
  if (localStorage.getItem("currentContact") === null) {
    localStorage.setItem("currentContact", 0);
  }
  if (localStorage.getItem("deletedContacts") === null) {
    localStorage.setItem("deletedContacts", JSON.stringify([]));
  }

  // load contacts and currentContact from local storage
  const [contacts, setContacts] = useState(
    JSON.parse(localStorage.getItem("contacts"))
  );
  const [currentContact, setCurrentContact] = useState(
    localStorage.getItem("currentContact")
  );
  const [messageCount, setMessageCount] = useState(0);
  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newContact, setNewContact] = useState("");

  // update local storage every time contacts or currentContact changes
  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
    localStorage.setItem("currentContact", currentContact);
    scrollToBottom();
  }, [contacts, currentContact, messageCount]);

  useEffect(() => {
    // If the name parameter is present, create a new contact with the given name
    if (name) {
      // replace any underscores in the name with blanks
      name = name.replace(/_/g, " ");
      const existingContactIndex = contacts.findIndex(
        (contact) => contact.name.toLowerCase() === name.toLowerCase()
      );
      if (existingContactIndex === -1) {
        handleNewContact(name);
      } else {
        setCurrentContact(existingContactIndex);
      }
    }
  }, [name]);

  const handleContactClick = (index) => {
    setCurrentContact(index);
  };

  const handleDeleteContact = (index) => {
    if (contacts[index].name === "OtisFuse AI Helper") {
      // If the contact is the default contact, do nothing
      return;
    }
    const newContacts = [...contacts];
    const deletedContact = newContacts.splice(index, 1)[0];
    setContacts(newContacts);
    localStorage.setItem("contacts", JSON.stringify(newContacts));

    // Move deleted contact to deletedContacts array
    const deletedContacts = JSON.parse(localStorage.getItem("deletedContacts"));
    localStorage.setItem(
      "deletedContacts",
      JSON.stringify([...deletedContacts, deletedContact])
    );

    if (index === currentContact) {
      setCurrentContact(0);
      localStorage.setItem("currentContact", 0);
    } else if (index < currentContact) {
      setCurrentContact(currentContact - 1);
      localStorage.setItem("currentContact", currentContact - 1);
    }
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleNewContact = async (newContactName) => {
    const name = newContactName.trim();
    if (name) {
      const avatarUrl = await fetchImageUrl(name);
      const deletedContacts =
        JSON.parse(localStorage.getItem("deletedContacts")) || [];
      const existingContact = deletedContacts.find((c) => c.name === name);
      let newContact = null;
      if (existingContact) {
        newContact = existingContact;
        deletedContacts.splice(deletedContacts.indexOf(existingContact), 1);
        localStorage.setItem(
          "deletedContacts",
          JSON.stringify(deletedContacts)
        );
      } else {
        newContact = {
          avatar: avatarUrl || "https://via.placeholder.com/150",
          name: name,
          messages: [
            {
              message: `Hello... you've reached ${name}.`,
              time: getDateTimeString(),
              isUser: false,
            },
          ],
        };
      }
      const updatedContacts = sortContacts([...contacts, newContact]);
      setContacts(updatedContacts);
      setCurrentContact(0);
      setNewContact("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (event) => {

    // if we're already fetching a response, do nothing
    if (isFetchingResponse) {
      return;
    }

    // Get the current contact and append the user's message to its message list
    const userMessage = {
      message: event.target.value,
      time: getDateTimeString(),
      isUser: true,
    };
    contacts[currentContact].messages.push(userMessage);
    setMessageCount(messageCount + 1);
    setContacts([...contacts]);

    // Clear the input now that the message has been sent
    event.target.value = "";
    setIsFetchingResponse(true);
    inputRef.current.focus();

    // Call the chat API to get a response from the assistant
    try {
      const response = await Promise.race([
        fetchChatResponse(
          contacts[currentContact],
          contacts[currentContact].messages
        ),
        timeout(10000),
      ]);

      // Add the assistant's response to the messages array
      const assistantMessage = {
        message: response,
        time: getDateTimeString(),
        isUser: false,
      };
      contacts[currentContact].messages.push(assistantMessage);
    } catch (error) {
      console.error("Error fetching chat response", error);

      // Show an error message to the user
      contacts[currentContact].messages.push({
        message:
          "Sorry, I've been a little overloaded with messages. I'm taking a short break. Chat with me again soon!",
        time: getDateTimeString(),
        isUser: false,
      });
    } finally {
      setIsFetchingResponse(false);
    }

    // Sort contacts and update the states
    const updatedContacts = sortContacts([...contacts]);
    const newCurrentContactIndex = updatedContacts.findIndex(
      (contact) => contact.name === contacts[currentContact].name
    );
    setMessageCount(messageCount + 1);
    setContacts(updatedContacts);
    setCurrentContact(newCurrentContactIndex);
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
    const person = contacts[index];
    return (
      <div key={index} style={{ ...style }}>
        <Contact
          key={index}
          index={index}
          person={person}
          handleContactClick={handleContactClick}
          handleDeleteContact={handleDeleteContact}
          currentContact={currentContact}
        />
      </div>
    );
  };

  const timeout = (ms) => {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    );
  };

  // Desktop view for contacts
  const renderDesktopContactsSection = () => {
    return (
      <Col
        md="6"
        lg="5"
        xl="4"
        className="mb-4 mb-md-0"
        style={{ borderRight: "1px solid #aaa" }}
      >
        <div className="p-3">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleNewContact(newContact);
            }}
          >
            <Form.Group className="d-flex mb-3">
              <Form.Control
                type="text"
                placeholder="Type any name to start..."
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    handleNewContact(newContact);
                  }
                }}
              />
              <Button variant="primary" type="submit" className="border-0 ms-2">
                <PersonPlus size={24} />
              </Button>
            </Form.Group>
          </Form>
          <div
            className="contacts-section"
            style={{ height: "calc(100vh - 300px)" }}
          >
            <AutoSizer>
              {({ width, height }) => (
                <List
                  width={width}
                  height={height}
                  itemCount={contacts.length}
                  itemSize={100}
                  children={contactRenderer}
                />
              )}
            </AutoSizer>
          </div>
        </div>
      </Col>
    );
  };

  // Desktop view for messages
  const renderDesktopMessagesSection = () => {
    return (
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
          {contacts[currentContact].messages.map((msg, index) => (
            <Message
              key={index}
              message={msg.message}
              person={contacts[currentContact]}
              isUser={msg.isUser}
              time={msg.time}
            />
          ))}
          {renderLoadingIndicator()}
          <div ref={messagesEndRef} />
        </div>
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
            ref={inputRef}
            type="text"
            className="form-control form-control-lg"
            id="exampleFormControlInput2"
            placeholder="Type message"
            maxLength="200"
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            onKeyDown={(event) => {
              if (!isFetchingResponse && event.keyCode === 13) {
                handleSendMessage({ target: { value: messageText } });
                setMessageText("");
              }
            }}
          />
          <Button
            variant="dark"
            className="btn btn-primary ms-2"
            onClick={(event) => {
              if (!isFetchingResponse) {
                handleSendMessage({ target: { value: messageText } });
                setMessageText("");
              }
            }}
          >
            <ArrowRight size={24} />
          </Button>
        </div>
      </Col>
    );
  };

  // Mobile view for contacts button
  const renderMobileContactsSection = (contactsShareName) => {
    // Add a handler function for the delete contact button
    const handleRemoveContactButton = () => {
      handleDeleteContact(currentContact);
      setShowDeleteContactModal(false);
    };

    const renderShareModal = () => {
      const shareUrl = `${window.location.origin}/chat/${contacts[
        currentContact
      ].name.replace(/ /g, "_")}`;

      const handleCopyClick = () => {
        copyToClipboard(shareUrl);
        setShowShareModal(false);
      };

      const copyToClipboard = (text) => {
        const element = document.createElement("textarea");
        element.value = text;
        element.setAttribute("readonly", "");
        element.style.position = "absolute";
        element.style.left = "-9999px";
        document.body.appendChild(element);
        element.select();
        document.execCommand("copy");
        document.body.removeChild(element);
      };

      return (
        <Modal show={showShareModal} onHide={() => setShowShareModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Share on Social Media</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Share this contact on your favorite social media platforms:</p>
            <ButtonToolbar>
              <Button variant="outline-secondary" onClick={handleCopyClick}>
                <Clipboard size={24} /> Copy Link
              </Button>
              <Button
                variant="outline-primary"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl
                    )}`,
                    "_blank"
                  )
                }
              >
                <Facebook size={24} /> Facebook
              </Button>
              <Button
                variant="outline-info"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      shareUrl
                    )}`,
                    "_blank"
                  )
                }
              >
                <Twitter size={24} /> Twitter
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                      shareUrl
                    )}`,
                    "_blank"
                  )
                }
              >
                <BriefcaseFill size={24} /> LinkedIn
              </Button>
              <Button
                variant="outline-danger"
                onClick={() =>
                  window.open(`https://www.instagram.com/`, "_blank")
                }
              >
                <Instagram size={24} /> Instagram
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() =>
                  window.open(
                    `http://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                      shareUrl
                    )}`
                  )
                }
              >
                <Pinterest size={24} /> Pinterest
              </Button>
            </ButtonToolbar>
          </Modal.Body>
        </Modal>
      );
    };

    return (
      <>
        <div
          className="d-flex justify-content-between align-items-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#f8f9fa",
            padding: "0.5rem 1rem",
            borderBottom: "1px solid #aaa",
            zIndex: 1050,
          }}
        >
          <div className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              className="me-3"
              onClick={() => setShowContactsModal(true)}
            >
              <ChatSquareDotsFill size={24} />
            </Button>
            <h6 className="mb-0">{contacts[currentContact].name}</h6>
          </div>
          <div>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                <ThreeDotsVertical size={24} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleShareClick}>Share</Dropdown.Item>
                <Dropdown.Item onClick={() => setShowAboutModal(true)}>
                  About
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowDeleteContactModal(true)}>
                  Delete Contact
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* About Modal */}
        <Modal show={showAboutModal} onHide={() => setShowAboutModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>About</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AboutInfo />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAboutModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Contact Confirmation Modal */}
        <Modal
          show={showDeleteContactModal}
          onHide={() => setShowDeleteContactModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this contact?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteContactModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRemoveContactButton}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Share Modal */}
        {renderShareModal()}
      </>
    );
  };

  const renderContactsModal = () => {
    return (
      <Modal
        show={showContactsModal}
        onHide={toggleContactsModal}
        size="xl"
        dialogClassName="modal-100w"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Contacts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleNewContact(newContact);
              toggleContactsModal();
            }}
          >
            <Form.Group className="d-flex">
              <Form.Control
                type="text"
                placeholder="Start new chat"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
              />
              <Button variant="primary" type="submit" className="ms-2">
                <PersonPlus size={20} />
              </Button>
            </Form.Group>
          </Form>
          <div
            className="contacts-list"
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            {contacts.map((person, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentContact(index);
                  toggleContactsModal();
                }}
                className={`d-flex align-items-center p-2 ${
                  currentContact === index ? "bg-light" : ""
                }`}
              >
                <Image
                  src={person.avatar}
                  roundedCircle
                  style={{
                    width: "50px",
                    height: "50px",
                    padding: "2px",
                    border: "1px solid #000",
                  }}
                />
                <span className="ms-3">{person.name}</span>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const toggleContactsModal = () => {
    setShowContactsModal(!showContactsModal);
  };

  const renderMobileMessagesSection = () => {
    return (
      <>
        <div
          className="messages-section"
          style={{
            width: "100%",
            height: "calc(100vh - 50px)",
            overflowY: "auto",
            paddingTop: "75px", // Add padding to the top to avoid overlapping with the input
            paddingRight: "1rem",
            marginBottom: "60px", // Add margin to the bottom to avoid overlapping with the input
          }}
        >
          {contacts[currentContact].messages.map((msg, index) => (
            <Message
              key={index}
              message={msg.message}
              person={contacts[currentContact]}
              isUser={msg.isUser}
              time={msg.time}
            />
          ))}
          <div ref={messagesEndRef} />
          {renderLoadingIndicator()}
        </div>
        <div
          className="fixed-bottom"
          style={{
            borderTop: "1px solid #aaa",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          }}
        >
          <div className="text-muted d-flex justify-content-center align-items-center pt-3">
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
              ref={inputRef}
              type="text"
              className="form-control form-control-lg small-text-on-mobile"
              id="exampleFormControlInput2"
              placeholder="Type message"
              maxLength="200"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              onKeyDown={(event) => {
                if (!isFetchingResponse && event.keyCode === 13) {
                  handleSendMessage({ target: { value: messageText } });
                  setMessageText("");
                }
              }}
            />
            <Button
              variant="dark"
              className="btn btn-primary ms-2"
              onClick={(event) => {
                if (!isFetchingResponse) {
                  handleSendMessage({ target: { value: messageText } });
                  setMessageText("");
                }
              }}
            >
              <ArrowRight size={24} />
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <Container
      fluid
      className="py-2"
      style={{ height: "100vh", maxHeight: "100vh", overflow: "hidden" }}
    >
      <Row>
        <Col xs={12}>
          <Row>
            <MediaQuery maxWidth={767}>
              {(matches) =>
                matches ? (
                  // Mobile layout
                  <>
                    {renderMobileContactsSection()}
                    {renderMobileMessagesSection()}
                  </>
                ) : (
                  // Desktop layout
                  <>
                    {renderDesktopContactsSection()}
                    {renderDesktopMessagesSection()}
                  </>
                )
              }
            </MediaQuery>
          </Row>
        </Col>
      </Row>
      {renderContactsModal()}
    </Container>
  );
};

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

const sortContacts = (contacts) => {
  return contacts.sort((a, b) => {
    const lastMessageTimeA = new Date(a.messages[a.messages.length - 1].time);
    const lastMessageTimeB = new Date(b.messages[b.messages.length - 1].time);
    return lastMessageTimeB - lastMessageTimeA;
  });
};

const getDateTimeString = () => {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  return `${date} ${time}`;
};

export default Chat;
