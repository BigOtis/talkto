import { Link } from "react-router-dom";
import { Nav, Container, Image } from "react-bootstrap";
import otisfuse from '../img/of.png';

const Menu = () => {
  return (
    <Container>
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <Link
          to="/"
          className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
        >
          <Image src={otisfuse} alt="" rounded className="img-fluid me-2" style={{ width: "50px", height: "50px" }} />
          <span style={{ fontSize: "1.5rem" }}>Talk To AI</span>
        </Link>
        <Nav>
          <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
            <li>
              <Link to="/" className="nav-link px-2 link-secondary">
                Chat
              </Link>
            </li>
          </ul>
          <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
            <li>
              <Link to="/about" className="nav-link px-2 link-secondary">
                About
              </Link>
            </li>
          </ul>
        </Nav>
      </header>
    </Container>
  );
};

export default Menu;
