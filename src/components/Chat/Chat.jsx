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

const Chat = () => {  

    const me = { avatar: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp", name: "me" }
    const toni = { avatar: "https://images.gr-assets.com/authors/1494211316p8/3534.jpg", name: "Toni Morrison", messages: [{"message": "There is no time for despair, no place for self-pity, no need for silence, no room for fear. We speak, we write, we do language. That is how civilizations heal.", "time": "Now", "isUser": false}] }

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

    // update local storage every time contacts or currentContact changes
    useEffect(() => {
      localStorage.setItem("contacts", JSON.stringify(contacts));
      localStorage.setItem("currentContact", currentContact);;      
    });


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
                        />
                        <span
                          className="input-group-text border-0"
                          id="search-addon"
                        >
                          <MDBIcon fas icon="search" />
                        </span>
                      </MDBInputGroup>

                        <MDBTypography listUnStyled className="mb-0">
                          <Contact person={contacts[currentContact]}></Contact>
                        </MDBTypography>
                    </div>
                  </MDBCol>
                  <MDBCol md="6" lg="7" xl="8">
                    {contacts[currentContact].messages.map((msg, index) => (
                      <Message key={index} message={msg.message} person={contacts[currentContact]} isUser={msg.isUser} time={msg.time} />
                    ))}

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
                    onKeyDown={(event) => {
                      // if the enter button was pressed
                      if (event.keyCode === 13) {
                        console.log(event.target.value);
                        // get the current contact and append our message to it's message list
                        contacts[currentContact].messages.push({
                          message: event.target.value,
                          time: "Now",
                          isUser: true,
                        });
                        // update the message count
                        setMessageCount(messageCount + 1);
                        
                        // clear the input now that the message has been sent
                        event.target.value = "";
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

export default Chat;