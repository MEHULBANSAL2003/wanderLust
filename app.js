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


 

//  app.get("/testListing",async (req,res)=>{
//      let sampleListing=new Listing({
//          title:"My New Villa",
//          description:"By the Beach",
//          price:1200,
//          location:"Calangute,Goa",
//          country: "  India"
//      })
//  await sampleListing.save();
//  console.log("sample was saved");
//  res.send("succesfull testing");
 
      
//  })    
 
 // INDEX ROUTE: get request on /listings..!!
 app.get("/listings", wrapAsync(async (req,res)=>{
   const listings= await Listing.find({});
   res.render("listings/index.ejs",{listings});

    // res.send("working");
 }));


 // CREATE ROUTE.. for new listing
 app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs"); 
 })

 app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{

   //validating server side using JOI
//     let result= listingSchema.validate(req.body);  // it will check the data.. and if any field is missing it will give error
//    console.log(result);
//    if(result.error){  // if errorr is there we will throw it...!!
//     throw new ExpressError(400,result.error);
//    }
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing")
    // }
    // // try{
     let listing=req.body.listing;
    // // now we will check fo individual keys whethere they are valid or not..!!
    // if(!listing.title){
    //     throw new ExpressError(400,"Title is missing")
    // }
    // if(!listing.description){
    //     throw new ExpressError(400,"Description is missing")
    // }
    // if(!listing.location){
    //     throw new ExpressError(400,"Location is missing")
    // }
    // if(!listing.price){
    //     throw new ExpressError(400,"Price is missing")
    // }
    // if(!listing.country){
    //     throw new ExpressError(400,"Country is missing")
    // }


    const newListing = {
        title: listing.title,
        description: listing.description,
        image: {
            filename: "listingimage",
            url: listing.image
        },
        price: listing.price,
        location: listing.location,
        country: listing.country
    };

    const finalListing=new Listing(newListing);

    await finalListing.save();
    res.redirect("/listings");
// }catch(err){
//     next(err);
// }
    

    //console.log(newListing);

 }));

 // edit route
 app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
 }));

 // put request
 app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing")
    // }
    let {id}=req.params;
    console.log(id);
    let listing=req.body.listing;
    
    const newListing = {
        title: listing.title,
        description: listing.description,
        image: {
            filename: "listingimage",
            url: listing.image
        },
        price: listing.price,
        location: listing.location,
        country: listing.country
    };


  const updatedList=await Listing.findByIdAndUpdate(id,newListing);

  // Listing.findByIdAndUpdate(id,{newListing});

   res.redirect("/listings");

 }));

 // show route to print the data of clicked title

 app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
     const listing=await Listing.findById(id).populate("reviews");  // for printing actual review

     res.render("listings/show.ejs",{listing});

 }));

 app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const deletedListing=await Listing.findByIdAndDelete(id); // this line will automatically trigger mongoose middleware
    console.log(deletedListing);
    res.redirect("/listings");   
}));

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
 