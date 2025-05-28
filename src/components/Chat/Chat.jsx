// React components
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import MediaQuery from 'react-responsive';

import {
  Modal,
  Button,
  Container,
  Row,
  Col,
  Image,
  Form,
  Dropdown,
  ButtonToolbar,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
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
  PencilSquare,
} from 'react-bootstrap-icons';

// Custom components
import Message from './Message';
import Contact from './Contact';
import AboutInfo from '../AboutInfo';
import AvatarModal from './AvatarModal';
import useStickyState from 'use-sticky-state';
import EmailModal from './EmailModal';
import EditContactModal from './EditContactModal';

// Utils
import { fetchChatResponse, fetchGreetings } from '../../utils/chatAPI';

// Assets
import userAvatarImg from '../../img/avatar2.png';
import helperAvatar from '../../img/helper.jpg';

// Styles
import './chat.css';
import '../../index.css';

const Chat = () => {
  let { name } = useParams();

  const toni = {
    avatar: helperAvatar,
    name: "OtisFuse AI Helper",
    messages: [
      {
        message:
          "Welcome to OtisFuse AI Chat, where you can talk to any character or historical figure you can imagine. Just type any name you want to chat with in the new conversation area to create a new character to chat with. Let me know if you have any questions or if you want me to suggest some famous characters for you to chat with. Remember, all conversations are purely fictional in nature.",
        time: getDateTimeString(),
        isUser: false,
      },
    ],
  };
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [contacts, setContacts] = useStickyState([toni], "contacts");
  const [currentContact, setCurrentContact] = useStickyState(0, "currentContact");
  const [deletedContacts, setDeletedContacts] = useStickyState([], "deletedContacts");

  const [messageCount, setMessageCount] = useStickyState(0, "messageCount");
  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const [isFetchingContact, setIsFetchingContact] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newContact, setNewContact] = useState("");
  const [userAvatar, setUserAvatar] = useStickyState(userAvatarImg, "userAvatar");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEditContactModal, setShowEditContactModal] = useState(false);  
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupParticipants, setGroupParticipants] = useState([]);
  const [groupParticipantInput, setGroupParticipantInput] = useState("");
  const [showAddAvatarModal, setShowAddAvatarModal] = useState(false);
  const [addAvatarName, setAddAvatarName] = useState("");
  const [addAvatarLoading, setAddAvatarLoading] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);

  useEffect(() => {
    console.log("deletedContacts changed");
    console.log(deletedContacts);
  }, [deletedContacts]);

  // update local storage every time contacts or currentContact changes
  useEffect(() => {
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

    // Move deleted contact to deletedContacts array
    const newDeleted = [...deletedContacts, deletedContact];

    setContacts(newContacts);
    setDeletedContacts(newDeleted);
   
    if (index === currentContact) {
      setCurrentContact(0);
    } else if (index < currentContact) {
      setCurrentContact(currentContact - 1);
    }
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleEditContactClick = () => {
    setShowEditContactModal(true);
  };
  
  const handleSaveEditContact = (updatedContact) => {
    let updatedContacts = [...contacts];
    updatedContacts[currentContact] = updatedContact;
    setContacts(updatedContacts);
    setShowEditContactModal(false);
  };  

  const handleNewContact = async (newContactName) => {
    setIsFetchingContact(true);
    const name = newContactName.trim();
    if (name) {
      const avatarUrl = await fetchImageUrl(name);
      if (avatarUrl) {
        const cachedImg = new window.Image();
        cachedImg.src = avatarUrl;
      }
      const existingContact = deletedContacts.find((c) => c.name === name);
      let newContact = null;
      if (existingContact) {
        newContact = existingContact;
        deletedContacts.splice(deletedContacts.indexOf(existingContact), 1);
        setDeletedContacts([...deletedContacts]);
      } else {
        let message = await fetchGreetings(newContactName);
        // if the message is undefined, set it to a default message
        if (!message) {
          message = `Hello... you've reached ${name}.`;
        }
        newContact = {
          avatar: avatarUrl || "https://via.placeholder.com/150",
          name: name,
          messages: [
            {
              message: message,
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
      setIsFetchingContact(false);
      // Check if number is divisible by 3 and show email modal unless email already exists
      if (!localStorage.getItem('userEmail') && contacts.length % 3 === 0 ) {
        setShowEmailModal(true);
      }
  }
  else{
    setIsFetchingContact(false);
  }
};

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (event) => {
    if (isFetchingResponse) {
      return;
    }

    const userMessage = {
      message: event.target.value,
      time: getDateTimeString(),
      isUser: true,
      from: 'user',
    };
    contacts[currentContact].messages.push(userMessage);
    setMessageCount(messageCount + 1);
    setContacts([...contacts]);

    event.target.value = "";
    setIsFetchingResponse(true);
    inputRef.current.focus();

    // Group chat logic
    if (contacts[currentContact].type === 'group' || contacts[currentContact].isGroup) {
      const group = contacts[currentContact];
      // Prepare the last 10 messages, prepending character messages with the sender's name
      const lastMessages = group.messages.slice(-10).map(m => {
        if (!m.isUser && m.from) {
          return { ...m, message: `${m.from}: ${m.message}` };
        }
        return m;
      });
      // Randomly select a participant
      const randomIdx = Math.floor(Math.random() * group.participants.length);
      const participant = group.participants[randomIdx];
      try {
        const response = await Promise.race([
          fetchChatResponse(participant, lastMessages),
          timeout(120000),
        ]);
        const assistantMessage = {
          message: response,
          time: getDateTimeString(),
          isUser: false,
          from: participant.name,
        };
        group.messages.push(assistantMessage);
      } catch (error) {
        group.messages.push({
          message: "Sorry, I've been a little overloaded with messages. I'm taking a short break. Chat with me again soon!",
          time: getDateTimeString(),
          isUser: false,
          from: 'system',
        });
      } finally {
        setIsFetchingResponse(false);
      }
      setMessageCount(messageCount + 1);
      setContacts([...contacts]);
      return;
    }

    // Call the chat API to get a response from the assistant
    try {
      const response = await Promise.race([
        fetchChatResponse(
          contacts[currentContact],
          contacts[currentContact].messages
        ),
        timeout(120000),
      ]);
  
      const assistantMessage = {
        message: response,
        time: getDateTimeString(),
        isUser: false,
      };
      contacts[currentContact].messages.push(assistantMessage);
    } catch (error) {
      console.error("Error fetching chat response", error);
  
      if (error.message.includes('Your message content violates the terms of service.')) {
        userMessage.message = 'This message violated the terms of service';
        contacts[currentContact].messages.pop(); // Remove the last message (user's violating message)
        contacts[currentContact].messages.push(userMessage); // Push the sanitized message
      } else {
        // Handle other types of errors
        contacts[currentContact].messages.push({
          message: "Sorry, I've been a little overloaded with messages. I'm taking a short break. Chat with me again soon!",
          time: getDateTimeString(),
          isUser: false,
        });
      }
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

  const renderContactsLoading = () => {
    if (isFetchingContact) {
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
                aria-label="Start new chat"
              />
              <Button variant="primary" type="submit" className="border-0 ms-2" aria-label="Add new chat">
                <PersonPlus size={24} />
              </Button>
            </Form.Group>
          </Form>
          {renderContactsLoading()}
          <div className="contacts-section" style={{ height: "calc(100vh - 200px)" }}>
            <ul className="list-unstyled mb-0">
              {contacts.map((person, index) => (
                <Contact
                  key={index}
                  index={index}
                  person={person}
                  handleContactClick={handleContactClick}
                  handleDeleteContact={handleDeleteContact}
                  currentContact={currentContact}
                />
              ))}
            </ul>
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
          className="messages-section d-flex flex-column"
          style={{
            width: "100%",
            height: "calc(100vh - 200px)",
            overflowY: "auto",
            paddingRight: "1rem",
          }}
          tabIndex={0}
          aria-label="Chat messages"
        >
          <div className="mt-auto">
            <div className="d-flex align-items-center mb-2">
              <h6 className="mb-0">{contacts[currentContact].name}</h6>
              {contacts[currentContact].isGroup && (
                <span style={{ background: '#3b82f6', color: 'white', borderRadius: 6, fontSize: 12, padding: '2px 8px', marginLeft: 10 }}>Group</span>
              )}
            </div>
            <Message
              key={0}
              message={`Remember, this conversation is purely fictional and does not reflect the views of any real person or organization. Enjoy your chat with ${contacts[currentContact].name}!`}
              person={toni}
              isUser={false}
              time={""}
              from={contacts[currentContact].messages[contacts[currentContact].messages.length - 1].from}
              participants={contacts[currentContact].participants}
            />
            {contacts[currentContact].messages.map((msg, index) => (
              <Message
                key={index}
                message={msg.message}
                person={contacts[currentContact]}
                isUser={msg.isUser}
                time={msg.time}
                userAvatar={userAvatar}
                from={msg.from}
                participants={contacts[currentContact].participants}
              />
            ))}
            {renderLoadingIndicator()}
          </div>
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area mt-2" aria-label="Type your message">
          <Image
            src={userAvatar}
            onClick={() => { setShowAvatarModal(true) }}
            roundedCircle
            style={{ width: "44px", height: "44px", border: "2px solid #3b82f6", marginRight: "8px", cursor: "pointer" }}
            alt="Your avatar"
            tabIndex={0}
            aria-label="Change your avatar"
          />
          <input
            ref={inputRef}
            type="text"
            className="form-control form-control-lg border-0 bg-transparent"
            id="chatInputDesktop"
            placeholder="Type message..."
            maxLength="200"
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            onKeyDown={(event) => {
              if (!isFetchingResponse && event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage({ target: { value: messageText } });
                setMessageText("");
              }
            }}
            aria-label="Message input"
          />
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="send-tooltip">Send message</Tooltip>}
          >
            <Button
              variant="primary"
              className="ms-2 d-flex align-items-center justify-content-center"
              style={{ borderRadius: "50%", width: "44px", height: "44px" }}
              onClick={() => {
                if (!isFetchingResponse) {
                  handleSendMessage({ target: { value: messageText } });
                  setMessageText("");
                }
              }}
              aria-label="Send message"
            >
              <ArrowRight size={24} />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="edit-contact-tooltip">Edit current contact info</Tooltip>}
          >
            <Button
              variant="outline-secondary"
              className="ms-2 d-flex align-items-center justify-content-center"
              style={{ borderRadius: "50%", width: "44px", height: "44px" }}
              onClick={() => setShowEditContactModal(true)}
              aria-label="Edit contact"
            >
              <PencilSquare size={24} />
            </Button>
          </OverlayTrigger>
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
      const shareUrl = `${window.location.origin}/redirect/${contacts[
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
            {renderContactsLoading()}
          </div>
          <div>
            {renderDropdownMenu()}
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
                aria-label="Start new chat"
              />
              <Button variant="primary" type="submit" className="ms-2" aria-label="Add new chat">
                <PersonPlus size={20} />
              </Button>
            </Form.Group>
          </Form>
          <div className="contacts-list" style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <ul className="list-unstyled mb-0">
              {contacts.map((person, index) => (
                <Contact
                  key={index}
                  index={index}
                  person={person}
                  handleContactClick={(i) => {
                    setCurrentContact(i);
                    toggleContactsModal();
                  }}
                  handleDeleteContact={handleDeleteContact}
                  currentContact={currentContact}
                />
              ))}
            </ul>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const renderDropdownMenu = () => {
    return(
      <div>
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
          <ThreeDotsVertical size={24} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={handleShareClick}>Share</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowAboutModal(true)}>About</Dropdown.Item>
          <Dropdown.Item onClick={handleEditContactClick}>Edit Contact</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowDeleteContactModal(true)}>Delete Contact</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowAddAvatarModal(true)}>Add Avatar to Chat</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowParticipantsModal(true)}>View Participants</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
    );
  };

  const toggleContactsModal = () => {
    setShowContactsModal(!showContactsModal);
  };

  const renderMobileMessagesSection = () => {
    return (
      <>
        <div
          className="messages-section d-flex flex-column"
          style={{
            width: "100%",
            height: "calc(100vh - 50px)",
            overflowY: "auto",
            paddingTop: "75px",
            paddingRight: "1rem",
            marginBottom: "60px",
          }}
          tabIndex={0}
          aria-label="Chat messages"
        >
          <div className="mt-auto">
            <div className="d-flex align-items-center mb-2">
              <h6 className="mb-0">{contacts[currentContact].name}</h6>
              {contacts[currentContact].isGroup && (
                <span style={{ background: '#3b82f6', color: 'white', borderRadius: 6, fontSize: 12, padding: '2px 8px', marginLeft: 10 }}>Group</span>
              )}
            </div>
            <Message
              key={0}
              message={`Remember, this conversation is purely fictional and does not reflect the views of any real person or organization. Enjoy your chat with ${contacts[currentContact].name}!`}
              person={toni}
              isUser={false}
              time={""}
              from={contacts[currentContact].messages[contacts[currentContact].messages.length - 1].from}
              participants={contacts[currentContact].participants}
            />
            {contacts[currentContact].messages.map((msg, index) => (
              <Message
                key={index}
                message={msg.message}
                person={contacts[currentContact]}
                isUser={msg.isUser}
                time={msg.time}
                userAvatar={userAvatar}
                from={msg.from}
                participants={contacts[currentContact].participants}
              />
            ))}
            <div ref={messagesEndRef} />
            {renderLoadingIndicator()}
          </div>
        </div>
        <div
          className="input-area fixed-bottom"
          style={{ borderTop: "1px solid #aaa", paddingLeft: "1rem", paddingRight: "1rem" }}
          aria-label="Type your message"
        >
          <Image
            src={userAvatar}
            onClick={() => { setShowAvatarModal(true) }}
            roundedCircle
            style={{ width: "44px", height: "44px", border: "2px solid #3b82f6", marginRight: "8px", cursor: "pointer" }}
            alt="Your avatar"
            tabIndex={0}
            aria-label="Change your avatar"
          />
          <input
            ref={inputRef}
            type="text"
            className="form-control form-control-lg border-0 bg-transparent small-text-on-mobile"
            id="chatInputMobile"
            placeholder="Type message..."
            maxLength="200"
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            onKeyDown={(event) => {
              if (!isFetchingResponse && event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage({ target: { value: messageText } });
                setMessageText("");
              }
            }}
            aria-label="Message input"
          />
          <Button
            variant="primary"
            className="ms-2 d-flex align-items-center justify-content-center"
            style={{ borderRadius: "50%", width: "44px", height: "44px" }}
            onClick={() => {
              if (!isFetchingResponse) {
                handleSendMessage({ target: { value: messageText } });
                setMessageText("");
              }
            }}
            aria-label="Send message"
          >
            <ArrowRight size={24} />
          </Button>
        </div>
        {/* Floating Action Button for New Chat */}
        <Button
          variant="primary"
          className="position-fixed"
          style={{
            bottom: 80,
            right: 24,
            borderRadius: "50%",
            width: 56,
            height: 56,
            zIndex: 2000,
            boxShadow: "0 4px 16px rgba(59,130,246,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => setShowContactsModal(true)}
          aria-label="Start new chat"
        >
          <PersonPlus size={28} />
        </Button>
      </>
    );
  };

  const renderEditContactModal = () => {
    return(
      <EditContactModal 
      contact={contacts[currentContact]}
      onContactChange={handleSaveEditContact}
      showEditContactModal={showEditContactModal} 
      setShowEditContactModal={setShowEditContactModal}
      />
    );
  }

  return (
    
    <Container
      fluid
      className="py-0"
      style={{ height: "100vh", maxHeight: "99vh", overflow: "hidden" }}
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
      {renderEditContactModal()}
      <AvatarModal 
        avatar={userAvatar}
        setShowAvatarModal={setShowAvatarModal}
        showAvatarModal={showAvatarModal}
        onAvatarChange={setUserAvatar}/>
      <EmailModal showEmailModal={showEmailModal} setShowEmailModal={setShowEmailModal} />
      <Modal show={showGroupModal} onHide={() => setShowGroupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Group Name</Form.Label>
            <Form.Control type="text" value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Enter group name" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Add Participant</Form.Label>
            <Form.Control type="text" value={groupParticipantInput} onChange={e => setGroupParticipantInput(e.target.value)} placeholder="Enter participant name" />
            <Button className="mt-2" onClick={() => {
              if (groupParticipantInput.trim() && !groupParticipants.includes(groupParticipantInput.trim())) {
                setGroupParticipants([...groupParticipants, groupParticipantInput.trim()]);
                setGroupParticipantInput("");
              }
            }}>Add</Button>
          </Form.Group>
          <div>
            <strong>Participants:</strong>
            <ul>
              {groupParticipants.map((p, i) => (
                <li key={i}>{p} <Button size="sm" variant="danger" onClick={() => setGroupParticipants(groupParticipants.filter((name, idx) => idx !== i))}>Remove</Button></li>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGroupModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => {
            if (groupName.trim() && groupParticipants.length > 0) {
              setContacts([{ type: 'group', name: groupName.trim(), participants: groupParticipants.map(name => ({ name, avatar: '' })), messages: [] }, ...contacts]);
              setShowGroupModal(false);
              setGroupName("");
              setGroupParticipants([]);
            }
          }}>Create Group</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAddAvatarModal} onHide={() => { setShowAddAvatarModal(false); setAddAvatarName(""); setAddAvatarLoading(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>Add Avatar to Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Avatar Name</Form.Label>
            <Form.Control type="text" value={addAvatarName} onChange={e => setAddAvatarName(e.target.value)} placeholder="Enter avatar name" />
          </Form.Group>
          {addAvatarLoading && <Spinner animation="border" />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowAddAvatarModal(false); setAddAvatarName(""); setAddAvatarLoading(false); }}>Cancel</Button>
          <Button variant="primary" disabled={addAvatarLoading || !addAvatarName.trim()} onClick={async () => {
            setAddAvatarLoading(true);
            const name = addAvatarName.trim();
            let avatarUrl = await fetchImageUrl(name);
            let greeting = await fetchGreetings(name);
            if (!greeting) greeting = `Hello... you've reached ${name}.`;
            if (!avatarUrl) avatarUrl = "https://via.placeholder.com/150";
            // Prepare new participant
            const newParticipant = { name, avatar: avatarUrl };
            // If not a group, convert to group
            let updatedContacts = [...contacts];
            let contact = updatedContacts[currentContact];
            if (!contact.isGroup) {
              contact.isGroup = true;
              contact.participants = [{ name: contact.name, avatar: contact.avatar, description: contact.description }];
            }
            contact.participants.push(newParticipant);
            setContacts(updatedContacts);
            setShowAddAvatarModal(false);
            setAddAvatarName("");
            setAddAvatarLoading(false);
          }}>Add</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showParticipantsModal} onHide={() => setShowParticipantsModal(false)}>
        <Modal.Header closeButton><Modal.Title>Participants</Modal.Title></Modal.Header>
        <Modal.Body>
          {contacts[currentContact].participants && contacts[currentContact].participants.map((p, i) => (
            <div key={i} className="d-flex align-items-center mb-2">
              <Image src={p.avatar} roundedCircle style={{ width: 36, height: 36, marginRight: 12 }} alt={p.name + ' avatar'} />
              <span>{p.name}</span>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowParticipantsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
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
