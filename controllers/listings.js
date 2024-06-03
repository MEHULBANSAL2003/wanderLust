const Listing=require("../models/listing"); 

module.exports.index=async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
  }