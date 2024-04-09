const mongoose=require("mongoose");

const Schema =mongoose.Schema;

const ListingSchema= new Schema({
 title:{
    type:String,
    required:true
},
 description:String,
 image:{
//   type:String,
//   default:"https://plus.unsplash.com/premium_photo-1671229455003-5e7b9aaae0dc?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29jb251dCUyMHRyZWV8ZW58MHx8MHx8fDA%3D",
//   set:(v)=> v===""?"https://plus.unsplash.com/premium_photo-1671229455003-5e7b9aaae0dc?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29jb251dCUyMHRyZWV8ZW58MHx8MHx8fDA%3D":v,

filename: String,
    url: String

},
 price:Number,
 location:String,
 country:String


})

const Listing = mongoose.model("Listing",ListingSchema);

module.exports=Listing;