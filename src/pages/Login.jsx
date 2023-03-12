import React from 'react';
import Header from '../components/Header'
import Meta from '../components/Meta'
import UserLogin from '../components/UserLogin';

const Login = () => {
    // page content
    const pageTitle = 'Login'
    const pageDescription = 'Login for additional perks like more free essay generations and the ability to purchase more essays.'
    const loginText = `Login to your account.`
    
    return (
        <div>
            <Meta title={pageTitle}/>
            <Header head={pageTitle} description={pageDescription} />
            <center>
            <hr />
                <UserLogin />
            </center>
        </div>
    )
}

export default Login;