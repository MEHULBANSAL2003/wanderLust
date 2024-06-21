const Listing=require("../models/listing"); 

module.exports.index=async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
  }

  module.exports.renderNewForm=(req, res) => {
 
    res.render("listings/new.ejs");
  }


  module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner"); // for printing actual review
    if(!listing){
      req.flash("error","Listing you requested for does not exists!");
      res.redirect("/listings");
    }
    //console.log(listing);

    res.render("listings/show.ejs", { listing });
  }

  module.exports.createListing=async (req, res, next) => {
    let listing = req.body.listing;
    console.log(listing);

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
     finalListing.owner=req.user._id;

    await finalListing.save();
    req.flash("success","new lisitng created successfully!"); // flash msg when new lisitng is created  
    res.redirect("/listings");
  }


  module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exists!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }


  module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
   // console.log(id);
    let listing = req.body.listing;
    console.log(listing);
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
 
    listing=await Listing.findById(id);
    // console.log(listing.owner);
    // console.log(res.locals.currUser._id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","You don't have permission to edit");
     return res.redirect(`/listings/${id}`);
    }
    const updatedList = await Listing.findByIdAndUpdate(id, newListing);

    // Listing.findByIdAndUpdate(id,{newListing});
    req.flash("success","Listing Updated Successfully!");

    res.redirect("/listings");
  }


  module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id); // this line will automatically trigger mongoose middleware
     req.flash("success","Listing deleted successfully!")
    res.redirect("/listings");
  }