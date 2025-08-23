const mongoose=require("mongoose");
const schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

const User=mongoose.model("User",userSchema);

User.plugin(passportLocalMongoose);

module.exports=User;