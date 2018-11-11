const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HeadlineSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  summery: {
    type: String
  },
  // `comment` is an object that stores a Comment id
  // The ref property links the ObjectId to the Comment model
  // This allows us to populate the Headline with an associated comment
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

const Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline;
