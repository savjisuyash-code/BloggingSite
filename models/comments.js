var mongoose = require("mongoose");

//CommentSchema

var commentSchema = new mongoose.Schema({
    text : String,
    author : String
});

//Compile to the module
module.exports = mongoose.model("Comment", commentSchema);