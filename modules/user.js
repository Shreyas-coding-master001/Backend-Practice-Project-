let mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/userData");

const userSchema = mongoose.Schema({
    name : String,
    age: Number,
    image: String
});

module.exports = mongoose.model("user",userSchema);