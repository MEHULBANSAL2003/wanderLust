
const Listing = require("./models/listing");
const Review=require("./models/listing");
const { reviewSchema,listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in!");
        return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{

  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}


// just creating fucntion for validating schema in middleware

module.exports.validateListing=(req,res,next)=>{
  console.log(req.body);
  let {error}= listingSchema.validate(req.body);  // it will check the data.. and if any field is missing it will give error
  
  if(error){  // if errorr is there we will throw it...!!
      let errMsg=error.details.map((el)=> el.message).join(",");
      console.log("err");
          console.log(errMsg);
   throw new ExpressError(400,errMsg);
  }
  else{
      next();
  }
}

// function for server side validation of reviews
module.exports.validateReview=(req,res,next)=>{
  console.log(req.body);
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

module.exports.isOwner=async(req,res,next)=>{

  let { id } = req.params;
  // console.log(id);
   let listing=await Listing.findById(id);
   // console.log(listing.owner);
   // console.log(res.locals.currUser._id);
   if(!listing.owner.equals(res.locals.currUser._id)){
     req.flash("error","You don't have permission to edit");
    return res.redirect(`/listings/${id}`);
   }
   next();
}

// module.exports.isReviewAuthor=async(req,res,next)=>{
//   let {id,reviewId}=req.params;
//     let review=await Review.findById(reviewId);
//     console.log(review);

//     if(!review.author.equals(res.locals.currUser._id)){
//       req.flash("error","You are not author of this review");
//       res.redirect(`/listings/${id}`);
//     }

//     next();

// }