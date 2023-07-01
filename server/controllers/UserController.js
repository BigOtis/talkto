const { saveEmailToDB, removeEmailFromDB, verifyEmail } = require("../util/Mongo"); 
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASSWORD  
  }
});

exports.registerUser = async (req, res) => {
  try {
    const email = req.body.email;
    const verificationToken = crypto.randomBytes(2).toString('hex');
    await saveEmailToDB(email, verificationToken);

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking on the following link: 
             ${process.env.BASE_URL}/verifyemail/${email}/${verificationToken}`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  } catch (e) {
    console.log(e);
    // respond with failure code
    res.sendStatus(500);
  }
  
  // respond to client with a 200 status code
  res.sendStatus(200);
}

exports.resendVerificationToken = async (req, res) => {
  try {
    const email = req.body.email;
    const verificationToken = crypto.randomBytes(2).toString('hex');
    await updateEmailInDB(email, verificationToken);

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email,
      subject: 'Resend Verification Token',
      text: `Please verify your email by clicking on the following link: 
             ${process.env.BASE_URL}/verifyemail/${email}/${verificationToken}`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  } catch (e) {
    console.log(e);
    // respond with failure code
    res.sendStatus(500);
  }
  // respond to client with a 200 status code
  res.sendStatus(200);
}



// delete a user by email and remove their email from the database
exports.deleteUser = async (req, res) => {
    const email = req.body.email;
    try {
        await removeEmailFromDB(email);
    } catch (e) {
        console.log(e);
        // respond with failure code
        res.sendStatus(500);
    }
    res.sendStatus(200);
}

exports.verifyUser = async = async (req, res) => {
    const email = req.body.email;
    const verificationToken = req.body.verificationToken;
    try {
        await verifyEmail(email, verificationToken);
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}
