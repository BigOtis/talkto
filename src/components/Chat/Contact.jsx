import React from "react";
import { Image } from "react-bootstrap";
import { FiTrash2, FiShare } from "react-icons/fi";

const Contact = ({
  person,
  handleContactClick,
  handleDeleteContact,
  index,
  currentContact,
}) => {
  const lastMessage = person.messages && person.messages.length > 0 ? person.messages[person.messages.length - 1].message : 'No messages yet.';
  let lastMessageTruncated = lastMessage.length > 60 ? lastMessage.substring(0, 60) + "..." : lastMessage;

  const shareUrl = `${window.location.origin}/redirect/${person.name.replace(
    / /g,
    "_"
  )}`;

  const handleShareClick = () => {
    copyToClipboard(shareUrl);
    alert(`URL copied to clipboard: ${shareUrl}`);
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
    <li
      className={`contact-item d-flex justify-content-between align-items-center ${currentContact === index ? "selected" : ""}${person.isGroup ? " group-chat-contact" : ""}`}
      aria-label={`Chat with ${person.name}`}
      tabIndex={0}
      onClick={() => handleContactClick(index)}
      onKeyPress={e => { if (e.key === 'Enter') handleContactClick(index); }}
      style={{
        outline: currentContact === index ? '2px solid #3b82f6' : 'none',
        background: person.isGroup ? '#e6f0fa' : undefined,
        border: person.isGroup ? '2px solid #3b82f6' : undefined
      }}
    >
      <div className="d-flex align-items-center">
        <Image
          src={person.avatar}
          roundedCircle
          className="contact-avatar"
          style={{ width: "48px", height: "48px" }}
          alt={`${person.name} avatar`}
        />
        <div className="ms-2">
          <div className="fw-bold text-truncate" style={{ maxWidth: 120 }}>
            {person.name}
          </div>
          <div className="small text-muted text-truncate" style={{ maxWidth: 140 }}>
            {lastMessageTruncated}
          </div>
        </div>
      </div>
      {currentContact === index && (
        <div className="d-flex align-items-center ms-2">
          <button
            className="btn btn-sm btn-danger me-2"
            aria-label={`Delete chat with ${person.name}`}
            onClick={e => { e.stopPropagation(); handleDeleteContact(index); }}
            style={{ borderRadius: '50%' }}
          >
            <FiTrash2 />
          </button>
          <button
            className="btn btn-sm btn-primary"
            aria-label={`Share chat with ${person.name}`}
            onClick={e => { e.stopPropagation(); handleShareClick(person.name); }}
            style={{ borderRadius: '50%' }}
          >
            <FiShare />
          </button>
        </div>
      )}
    </li>
  );
};

export default Contact;
