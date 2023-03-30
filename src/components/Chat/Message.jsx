import React from "react";
import { Image } from "react-bootstrap";
import userAvatar from "../../img/avatar2.png";

const Message = ({ message, person, time, isUser }) => {
  if (isUser) {
    return (
      <div className="d-flex flex-row justify-content-start">
        <div style={{ minWidth: "60px" }}>
          <Image
            src={userAvatar}
            roundedCircle
            style={{ width: "60px", height: "60px", padding: "2px", border: "1px solid #000"}}
          />
        </div>
        <div>
          <p
            className="small p-2 ms-3 mb-1 rounded-3 small-text-on-mobile"
            style={{ backgroundColor: "#b3cee5" }}
          >
            {message}
          </p>
          <p className="small ms-3 mb-3 rounded-3 text-muted float-start small-text-on-mobile">
            {time}
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="d-flex flex-row justify-content-start">
        <div style={{ minWidth: "60px" }}>
          <Image
            src={person.avatar}
            roundedCircle
            style={{ width: "60px", height: "60px", padding: "2px", border: "1px solid #000"}}
          />
        </div>
        <div>
          <p
            className="small p-2 ms-3 mb-1 rounded-3 small-text-on-mobile"
            style={{ backgroundColor: "#f5f6f7" }}
          >
            {message}
          </p>
          <p className="small ms-3 mb-3 rounded-3 text-muted float-end small-text-on-mobile">
            {time}
          </p>
        </div>
      </div>
    );
  }
};

export default Message;
