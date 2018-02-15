var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var adminSchema = new mongoose.Schema(
    {
        username: String,
        password: String
    });
    

    


module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	console.log("here2" + username);
	Admin.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	Admin.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	console.log(candidatePassword);
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}


adminSchema.plugin(passportLocalMongoose); //adds methods to the user 
    
module.exports = mongoose.model("Admin",adminSchema);
