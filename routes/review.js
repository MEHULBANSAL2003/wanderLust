const express = require("express");
const router = express.Router({mergeParams:true}); // mergeparams is method to use the parent params also..!!
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {reviewSchema}=require("../schema.js");




// function for server side validation of reviews
const validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);  // it will check the data.. and if any field is missing it will give error
    
    if(error){  // if errorr is there we will throw it...!!
        let errMsg=error.details.map((el)=> el.message).join(",");
         console.log(errMsg);
     throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}


// routes for reviews..!!
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
     req.flash("success","New Review Created Successfully!");
    res.redirect(`/listings/${listing._id}`);
}));


// delete route for reviews

router.delete("/:reviewId",wrapAsync(async(req,res)=>{
  //  console.log("wroking");
   let {id,reviewId}=req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted Successfully!");
 res.redirect(`/listings/${id}`);
 
}));


module.exports=router;