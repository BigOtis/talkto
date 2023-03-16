import React from "react";
import { Image } from "react-bootstrap";


const Contact = ({ person, handleContactClick, index }) => {
  
    var lastMessage = person.messages[person.messages.length - 1].message;
    // if the last message is too long, truncate it
    if (lastMessage.length > 30) {
        lastMessage = lastMessage.substring(0, 75) + "...";
    }
    return( 
        <li className="p-2 border-bottom">
        <a
          href="#!"
          className="d-flex justify-content-between"
          onClick={() => handleContactClick(index)}
        >
          <div className="d-flex flex-row">
            <div>
               <Image src={person.avatar} roundedCircle style={{width: '60px', height: '60px', padding: '5px'}}/>
              <span className="badge bg-success badge-dot"></span>
            </div>
            <div className="pt-1">
              <p className="fw-bold mb-0">{person.name}</p>
              <p className="small text-muted">
                {lastMessage}
              </p>
            </div>
          </div>
        </a>
      </li>
 )
};

export default Contact;