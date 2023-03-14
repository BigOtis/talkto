import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "./layout/Layout";

// pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import About from "./pages/About";

const App = () => {
  return (
    <Layout>
      <Container>
        <Routes>
        <Route path="/" element={<Home />} exact />
          <Route path="/about" element={<About />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Container>
    </Layout>
  );
};

export default App;
