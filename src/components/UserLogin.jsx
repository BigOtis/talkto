import React from "react";
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie'

const UserLogin = () => {
    return (
        <GoogleLogin
            onSuccess={credentialResponse => {
                console.log('Login Success:', credentialResponse);
                // set expiration date for token
                const decoded = jwt_decode(credentialResponse.credential);
                console.log(decoded);
                const expirationDate = new Date(decoded.exp * 1000);
                // set token in cookies
                Cookies.set('token', credentialResponse.credential, { expires: expirationDate });
                window.location.href = '/';
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    )
}

export default UserLogin;