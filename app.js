const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate"); // for ejs styling.. templating   
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
 const {listingSchema,reviewSchema}=require("./schema.js");
 const Review=require("./models/review.js");
 
 const listings=require("./routes/listing.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
  console.log(err);
})


async function main(){
    await mongoose.connect(MONGO_URL);
 }
 
 

 app.get("/", (req,res)=>{
     res.send("hi i m root");
 })
 

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

app.use("/listings",listings);

//REVIEWS..!!

// routes for reviews..!!
app.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    console.log("review saved successfully");
    res.redirect(`/listings/${listing._id}`);
}));


// delete route for reviews

app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
  //  console.log("wroking");
   let {id,reviewId}=req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
 res.redirect(`/listings/${id}`);
 
}));




app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found")); 
}) 

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something Went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});  // rednering error.ejs file
 //   res.status(statusCode).send(message);
  
})

 app.listen(8080,()=>{
     console.log("server is listening to port 8080");
 });
 