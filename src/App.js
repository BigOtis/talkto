import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "./layout/Layout";

// pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import './index.css';
import CharacterRedirect from "./pages/CharacterRedirect";
import EmailVerification from "./pages/EmailVerification"; // import the new component

const App = () => {
  return (
    <Layout>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/about" element={<About />} />
          <Route path="/chat/:name" element={<Home />} />
          <Route path="/redirect/:name" element={<CharacterRedirect />} />
          <Route path="/verify/:email/:token" element={<EmailVerification />} /> {/* new route */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Container>
    </Layout>
  );
};

export default App;
