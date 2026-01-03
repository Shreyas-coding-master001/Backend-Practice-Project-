const mongoose = require("mongoose");

let postSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    content : String,
    LikedAcc: [{
        type: mongoose.Schema.Types.ObjectId, ref: "users"
    }]
},{timestamps: true});

module.exports = mongoose.model("posts",postSchema);
