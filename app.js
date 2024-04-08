const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

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
 app.get("/listings", async (req,res)=>{
   const listings= await Listing.find({});
   res.render("listings/index.ejs",{listings});

    // res.send("working");
 });

 // show route to print the data of clicked title

 app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
     const listing=await Listing.findById(id);

     res.render("listings/show.ejs",{listing});

 })

 app.listen(8080,()=>{
     console.log("server is listening to port 8080");
 });