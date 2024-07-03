const mongoose=require("mongoose");

const Schema =mongoose.Schema;

const Review=require("./review.js");
const User=require("./user.js")

const ListingSchema= new Schema({
 title:{
    type:String,
    required:true
},
 description:String,
 image:{
filename:{
    type:String,
    default:"listing_image"
},
    url: {
        type:String,
      
        set:(v)=> v===""?"https://plus.unsplash.com/premium_photo-1671229455003-5e7b9aaae0dc?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29jb251dCUyMHRyZWV8ZW58MHx8MHx8fDA%3D":v,
    }

},
 price:Number,
 location:String,
 country:String,

 reviews:[
    {
        type:Schema.Types.ObjectId,
        ref:"Review"
    },
 ],
 owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
 },



});


// adding post middleware to delete all the reviews associated with the listing which is deleted..!!
ListingSchema.post("findOneAndDelete",async(listing)=>{  // here listing in async has the data of the deleted leisting
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});

const Listing = mongoose.model("Listing",ListingSchema);

module.exports=Listing;