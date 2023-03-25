const { searchGoogleImages } = require("../util/googleImageScraper");
const { getAvatarFromDB, saveAvatarToDB } = require("../util/Mongo");

exports.searchForImageUrl = async (req, res) => {
    const { searchTerm } = req.body;

    // check if the image is already in the database
    let imageUrl = await getAvatarFromDB(searchTerm);
    // if the image url is not null, return it
    if(imageUrl){
        res.json({ imageUrl });
        return;
    }

    imageUrl = await searchGoogleImages(searchTerm);
    // if the image url is null, return an error
    if(!imageUrl){
        res.json({ imageUrl: "An error occurred searching for an image. Please try again later." });
        return;
    }
    res.json({ imageUrl });
    // since we generated a new imageUrl, save it to the database
    saveAvatarToDB(searchTerm, imageUrl, getClientIp(req));
};

// Function to parse client ip address from request
const getClientIp = (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  };



