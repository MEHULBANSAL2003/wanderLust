const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

// passporst local mongoose automatically create username and password and also add hash function and salting.. 
// so we dont need to explicitly add username and password in our database

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);