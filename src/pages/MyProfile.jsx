import Header from '../components/Header'
import Meta from '../components/Meta'
import React from 'react';
import { Button } from 'react-bootstrap'
import { Container, Row } from 'react-bootstrap'
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie'
// page content
const pageTitle = 'Profile'
const pageDescription = ''

const MyProfile = () => {

  if (isLoggedIn()) {
    return LoggedInProfile();
  }
  else {
    return LoggedOutProfile();
  }
}

const handleLogout = () => {
  Cookies.remove('token');
  window.location.href = '/';
}

const handleLogin = () => {
  window.location.href = '/login';
}

const LoggedOutProfile = () => {
  return (
    <div>
      <Meta title={pageTitle}/>
      <Header head={pageTitle} description={pageDescription} />
      <hr />
      <Container className="my-3">
        <Row>
          <Button variant="primary" onClick={handleLogin} size='lg'>
            Login
          </Button>
        </Row>
      </Container>
    </div>
  )
}

const LoggedInProfile = () => {
return (
  <div>
    <Meta title={pageTitle}/>
    <Header head={pageTitle} description={pageDescription} />
    <hr />
    <Container className="my-3">
      <Row>
        <Button variant="primary" onClick={handleLogout} size='lg'> 
          Logout 
        </Button>
      </Row>
    </Container>
</div>
)
}

const isLoggedIn = () => {
// Check our token to see if the user is logged in
const token = Cookies.get('token');
if (token) { // if we have a token
    const decoded = jwt_decode(token);
    const expirationDate = new Date(decoded.exp * 1000);
    if (expirationDate > new Date()) { // if the token is not expired
        return true;
    }
}  
return false;
}


export default MyProfile;