import { Link } from "react-router-dom";
import { Nav, Container } from "react-bootstrap";
import otisfuse from '../img/of.png';

const Menu = () => {
  return (
    <Container>
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <Link
          to="/"
          className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
        >
          <img src={otisfuse} alt="" className="img-fluid" />
          Talk To Historical Figures
        </Link>
        <Nav>
          <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
            <li>
              <Link to="/essay" className="nav-link px-2 link-secondary">
                New Essay
              </Link>
            </li>
            <li>
              <Link to="/history" className="nav-link px-2 link-secondary">
                History
              </Link>
            </li>
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
