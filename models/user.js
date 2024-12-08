
const mongoose = require("mongoose");
const { Schema } = mongoose;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});

// username khud he add kr dega (hash or salt bhi) 
userSchema.plugin(passportLocalMongoose); 

const User = mongoose.model("User", userSchema);

module.exports = User; 