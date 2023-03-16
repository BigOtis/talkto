import React from "react";
import { Image } from "react-bootstrap";

const userAvatar = "https://i.imgur.com/rPBTMRw.png";

const Message = ({ message, person, time, isUser }) => {

    if (isUser) {
        return (
            <div className="d-flex flex-row justify-content-start">
                <div>
                <p
                    className="small p-2 ms-3 mb-1 rounded-3"
                    style={{ backgroundColor: "#b3cee5" }}
                >
                    {message}
                </p>
                <p className="small ms-3 mb-3 rounded-3 text-muted float-start">
                    {time}
                </p>
                </div>
                <Image src={userAvatar} roundedCircle style={{width: '60px', height: '50px', padding: '2px', objectFit: 'cover' }}/>
            </div>
        )
    }
    else {
        return( 
            <div className="d-flex flex-row justify-content-start">
                <Image src={person.avatar} roundedCircle style={{width: '60px', height: '50px', objectFit: 'cover' }}/>
                <div>
                <p
                    className="small p-2 ms-3 mb-1 rounded-3"
                    style={{ backgroundColor: "#f5f6f7" }}
                >
                    {message}
                </p>
                <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
                    {time}
                </p>
                </div>
            </div>
        )
    }
};

export default Message;
