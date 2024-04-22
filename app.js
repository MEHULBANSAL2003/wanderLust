const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate"); // for ejs styling.. templating   
const ExpressError=require("./utils/ExpressError.js")
const session=require("express-session");

 //const {listingSchema,reviewSchema}=require("./schema.js");
 //const Review=require("./models/review.js");
 //const wrapAsync=require("./utils/wrapAsync.js")
 //const Listing=require("./models/listing.js");
 
 const listings=require("./routes/listing.js");
 const reviews=require("./routes/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true
}

app.use(session(sessionOptions));

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

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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
 