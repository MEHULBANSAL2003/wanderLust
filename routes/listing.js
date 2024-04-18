const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js")
const Listing=require("../models/listing.js");



// just creating fucntion for validating schema in middleware

const validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);  // it will check the data.. and if any field is missing it will give error
    
    if(error){  // if errorr is there we will throw it...!!
        let errMsg=error.details.map((el)=> el.message).join(",");
            console.log(errMsg);
     throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}


// INDEX ROUTE: get request on /listings..!!
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
  })
);

// CREATE ROUTE.. for new listing
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listing = req.body.listing;

    const newListing = {
      title: listing.title,
      description: listing.description,
      image: {
        filename: "listingimage",
        url: listing.image,
      },
      price: listing.price,
      location: listing.location,
      country: listing.country,
    };

    const finalListing = new Listing(newListing);

    await finalListing.save();
    res.redirect("/listings");
  })
);

// edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// put request
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    let listing = req.body.listing;

    const newListing = {
      title: listing.title,
      description: listing.description,
      image: {
        filename: "listingimage",
        url: listing.image,
      },
      price: listing.price,
      location: listing.location,
      country: listing.country,
    };

    const updatedList = await Listing.findByIdAndUpdate(id, newListing);

    // Listing.findByIdAndUpdate(id,{newListing});

    res.redirect("/listings");
  })
);

// show route to print the data of clicked title

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews"); // for printing actual review

    res.render("listings/show.ejs", { listing });
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id); // this line will automatically trigger mongoose middleware
    console.log(deletedListing);
    res.redirect("/listings");
  })
);


module.exports=router; 