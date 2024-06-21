if(process.env.NODE_ENV!="production"){
   require("dotenv").config();
}

console.log(process.env)

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate"); // for ejs styling.. templating   
const ExpressError=require("./utils/ExpressError.js")
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user.js");  

 //const {listingSchema,reviewSchema}=require("./schema.js");
 //const Review=require("./models/review.js");
 //const wrapAsync=require("./utils/wrapAsync.js")
 //const Listing=require("./models/listing.js");
 
 const listingRouter=require("./routes/listing.js");
 const reviewRouter=require("./routes/review.js");
 const userRouter=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000, // this is time in millisecond upto whihc we want our browser to save info
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.get("/", (req,res)=>{
    res.send("hi i m root");
})

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
 

 app.use(session(sessionOptions));
 app.use(flash());

 // we also need sessions for auth.. as for single session we dont want to user to login again and again for different pages

 app.use(passport.initialize()); // to initialize the passport
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // to store the information of user into a session for different pages
passport.deserializeUser(User.deserializeUser());  // to delete the info of user from session 


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);  // using user route

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
 