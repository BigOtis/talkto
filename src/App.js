import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Layout
import Layout from "./layout/Layout";

// pages
import Home from "./pages/Home";
import Essay from "./pages/Essay";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Viewer from "./pages/Viewer";
import Login from "./pages/Login";
import Privacy from "./pages/Privacy";
import MyProfile from "./pages/MyProfile";

const App = () => {
  return (
    <GoogleOAuthProvider clientId="863153693968-mc25kjdkn57bovab51dmsfb4d41s8rm4.apps.googleusercontent.com">
      <Layout>
        <Container>
          <Routes>
          <Route path="/" element={<Home />} exact />
            <Route path="/essay" element={<Essay />} exact />
            <Route path="/about" element={<About />} />
            <Route path="/history" element={<Viewer />} />
            <Route path="/login" element={<Login />} />
            <Route path='/privacy' element={<Privacy />} />
            <Route path='/myprofile' element={<MyProfile />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Container>
      </Layout>
    </GoogleOAuthProvider>
  );
};

export default App;
