const { saveEmailToDB, removeEmailFromDB } = require("../util/Mongo"); 

// register a new user by email and save their email to the database
exports.registerUser = async (req, res) => {
    try {
        email = req.body.email;
        await saveEmailToDB(email);
    } catch (e) {
        console.log(e);
    }
    // send a good response code
    res.status(200).send("User registered");
  };


// delete a user by email and remove their email from the database
exports.deleteUser = async (req, res) => {
    try {
        email = req.body.email;
        await removeEmailFromDB(email);
    } catch (e) {
        console.log(e);
    }
    res.status(200).send("User deleted");
}