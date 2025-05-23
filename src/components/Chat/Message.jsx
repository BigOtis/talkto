import React from "react";
import { Image } from "react-bootstrap";

const Message = ({ message, person, time, isUser, userAvatar }) => {
  const convertNamesToLinks = (messageText) => {
    const urlPrefix = `${window.location.origin}/redirect/`;
    const nameTagRegex = /<name>(.+?)<\/name>/g;

    return messageText.replace(nameTagRegex, (_, name) => {
      const url = urlPrefix + encodeURIComponent(name.replace(/ /g, "_"));
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`;
    });
  };

  const messageHtml = { __html: convertNamesToLinks(message) };

  if (isUser) {
    return (
      <div className="d-flex flex-row justify-content-end align-items-end mb-2">
        <div>
          <p
            className="message-bubble-user"
            aria-label="Your message"
          >
            {message}
          </p>
          <div className="d-flex justify-content-end">
            <span className="message-timestamp" aria-label="Sent time">{time}</span>
          </div>
        </div>
        <Image
          src={userAvatar}
          roundedCircle
          className="ms-2"
          style={{ width: "44px", height: "44px", border: "2px solid #3b82f6" }}
          alt="Your avatar"
        />
      </div>
    );
  } else {
    return (
      <div className="d-flex flex-row justify-content-start align-items-end mb-2">
        <Image
          src={person.avatar}
          roundedCircle
          className="me-2"
          style={{ width: "44px", height: "44px", border: "2px solid #e0e7ef" }}
          alt={`${person.name} avatar`}
        />
        <div>
          <p
            className="message-bubble-ai"
            aria-label={`${person.name} message`}
            dangerouslySetInnerHTML={messageHtml}
          />
          <div className="d-flex justify-content-start">
            <span className="message-timestamp" aria-label="Received time">{time}</span>
          </div>
        </div>
      </div>
    );
  }
};

export default Message;
