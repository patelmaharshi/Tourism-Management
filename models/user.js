var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        email: String,
        name: String,
        contact:String,
        isAdmin:{ type: Boolean, default: false },
        isManager:{ type: Boolean, default: false },
         interested:[
        {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "Place"
                 
        }],
        confirmed:[
        {
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Place"
            },
                 date:
                 {
                    type: Date
                 },
                 groupFormed:{ type: Boolean, default: false },
        }],

           

        confirmedPlaceId:[
        {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "Place"
        }]  


      
    });
    
userSchema.plugin(passportLocalMongoose); //adds methods to the user 
    
module.exports = mongoose.model("User",userSchema);