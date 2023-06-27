import React from 'react';
import { Link } from "react-router-dom";
import { Nav, Container, Image } from "react-bootstrap";
import otisfuse from '../img/of.png';
import { useMediaQuery } from 'react-responsive';
import {ChatDots, InfoCircle} from 'react-bootstrap-icons';

const Menu = () => {
  const isDesktop = useMediaQuery({ minWidth: 767 });

  return (
    <Container>
      {isDesktop && (
        <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4">
          <Link
            to="/"
            className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
          >
            <Image src={otisfuse} alt="" rounded className="img-fluid me-2" style={{ width: "50px", height: "50px" }} />
            <span style={{ fontSize: "1.5rem" }}>OtisFuse - AI Chat</span>
          </Link>
          <Nav>
            <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
              <li>
                <Link to="/" className="nav-link px-2 link-secondary">
                  <b>
                  <ChatDots className="me-1" />
                    Chat
                  </b>
                  </Link>
              </li>
            </ul>
            <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
              <li>
                <Link to="/about" className="nav-link px-2 link-secondary">
                <b>
                <InfoCircle className="me-1" />
                  About
                </b>
                </Link>
              </li>
            </ul>
          </Nav>
        </header>
      )}
    </Container>
  );
};

export default Menu;
