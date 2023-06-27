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
  const lastMessage = person.messages[person.messages.length - 1].message;

  // if the last message is too long, truncate it
  let lastMessageTruncated = lastMessage;
  if (lastMessage.length > 30) {
    lastMessageTruncated = lastMessage.substring(0, 75) + "...";
  }

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
    <li className="p-2 border-bottom">
      <div className="d-flex justify-content-between">
        <div
          className="d-flex flex-row"
          onClick={() => handleContactClick(index)}
        >
          <div>
            <Image
              src={person.avatar}
              roundedCircle
              style={{
                width: "55px",
                height: "55px",
                padding: "1px",
                border: "1px solid #000",
                marginRight: "10px",
              }}
            />
            <span className="badge bg-success badge-dot"></span>
          </div>
          <div className="pt-1 small-text-on-mobile">
            <p className="fw-bold mb-0">
              <u>{person.name}</u>
            </p>
            <p className="small text-muted">{lastMessageTruncated}</p>
          </div>
        </div>
        {currentContact === index && (
          <div className="d-flex">
            <div style={{ display: "inline-block" }}>
              <button
                className="btn btn-sm btn-danger me-2"
                onClick={() => handleDeleteContact(index)}
                style={{ position: "relative", top: "-2px" }}
              >
                <FiTrash2 />
              </button>
            </div>
            <div style={{ display: "inline-block" }}>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleShareClick(person.name)}
                style={{ position: "relative", top: "-2px" }}
              >
                <FiShare />
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default Contact;
