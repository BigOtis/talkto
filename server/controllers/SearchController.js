const { searchGoogleImages } = require("../util/googleImageScraper");

exports.searchForImageUrl = async (req, res) => {
    const { searchTerm } = req.body;
    const imageUrl = await searchGoogleImages(searchTerm);
    // if the image url is null, return an error
    if(!imageUrl){
        res.json({ imageUrl: "An error occurred searching for an image. Please try again later." });
        return;
    }
    res.json({ imageUrl });
};




