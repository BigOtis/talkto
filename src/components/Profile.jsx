import jwt_decode from "jwt-decode";
import { Button, Image, Nav } from 'react-bootstrap'
import Cookies from 'js-cookie'
let profileImage = "";

const Profile = () => {

    if (isLoggedIn()) {
        return loggedInProfile();
    } else {
        return loginButton();
    }
}

// display a small profile image from the user's Google account
const loggedInProfile = () => {
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <Nav>
                <Nav.Link href="/myprofile">
                    <Image src={profileImage} roundedCircle style={{width: '35px', height: '35px'}}/>
                </Nav.Link>
            </Nav>
        </div>
    )
}

// Login button that redirects to the login page
const loginButton = () => {
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <Button onClick={() => window.location.href = '/login'} variant="outline-primary">Login</Button>
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
            profileImage = decoded.picture;
            return true;
        }
    }  
    return false;
}

export default Profile;