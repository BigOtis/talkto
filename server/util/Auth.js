const {OAuth2Client} = require('google-auth-library');

// verifies if the google token is valid
exports.auth = async (verifyToken) => {
    const ticket = await client.verifyIdToken({
        idToken: verifyToken,
        audience: "863153693968-mc25kjdkn57bovab51dmsfb4d41s8rm4.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const email = payload['email'];
    return email;
}