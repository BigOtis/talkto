const { saveEmailToDB, removeEmailFromDB } = require("../util/Mongo"); 

// register a new user by email and save their email to the database
exports.registerUser = async (email) => {
    try {
        await saveEmailToDB(email);
    } catch (e) {
        console.log(e);
    }
}

// delete a user by email and remove their email from the database
exports.deleteUser = async (email) => {
    try {
        await removeEmailFromDB(email);
    } catch (e) {
        console.log(e);
    }
}