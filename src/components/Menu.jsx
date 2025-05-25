import React from 'react';
import { Link } from "react-router-dom";
import { Nav, Container, Image } from "react-bootstrap";
import otisfuse from '../img/of.png';
import { useMediaQuery } from 'react-responsive';
import { ChatDots, InfoCircle, BarChart } from 'react-bootstrap-icons';

const Menu = () => {
  const isDesktop = useMediaQuery({ minWidth: 767 });

  return (
    <Container fluid className="px-0">
      {isDesktop && (
        <header
          className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 glassy-header sticky-top shadow-lg"
          style={{
            borderRadius: '1.5rem',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
            marginTop: '1.5rem',
            marginBottom: '2rem',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            zIndex: 1100
          }}
        >
          <Link
            to="/"
            className="d-flex flex-column align-items-start col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
            style={{ minWidth: 180 }}
          >
            <div className="d-flex align-items-center">
              <Image src={otisfuse} alt="OtisFuse Logo" rounded className="img-fluid me-2" style={{ width: "56px", height: "56px", boxShadow: '0 2px 8px rgba(59,130,246,0.10)' }} />
              <span style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: '0.02em', fontFamily: 'Comfortaa, cursive' }}>OtisFuse</span>
            </div>
            <span style={{ fontSize: '1.1rem', color: '#3b82f6', fontWeight: 500, marginLeft: 4, marginTop: 2, letterSpacing: '0.01em' }}>Chat with AI Personalities</span>
          </Link>
          <Nav>
            <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0" style={{ alignItems: 'center' }}>
              <li>
                <Link to="/" className="nav-link px-3 link-secondary d-flex align-items-center" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  <ChatDots className="me-2" size={20} />
                  <span>Chat</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="nav-link px-3 link-secondary d-flex align-items-center" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  <InfoCircle className="me-2" size={20} />
                  <span>About</span>
                </Link>
              </li>
              <li>
                <a href="/stats" className="nav-link px-3 link-secondary d-flex align-items-center" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  <BarChart className="me-2" size={20} />
                  <span>Stats</span>
                </a>
              </li>
            </ul>
          </Nav>
        </header>
      )}
    </Container>
  );
};

export default Menu;
