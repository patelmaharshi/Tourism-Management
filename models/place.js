var mongoose = require("mongoose");

//schema set up
var placeSchema = new mongoose.Schema(
    {
       name: String,
       image: String,
       description: String,
       location: String,
       hasFormedGroups:{ type: Boolean, default: false },
       author:
       {
           id: 
           {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User"
           },
           username: String
       },
       comments:[
           {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Comment" //name of model
           }],

        interested:[
        {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "User"
        }] ,
        confirmed:[
        {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "User"
        }]   
    });
    
module.exports = mongoose.model("Place",placeSchema);