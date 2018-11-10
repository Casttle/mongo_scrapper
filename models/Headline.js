const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

const HeadlineSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true,
    unique: true
  },
  // `link` is required and of type String
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

// This creates our model from the above schema, using mongoose's model method
const Headline = mongoose.model("Headline", HeadlineSchema);

// Export the Article model
module.exports = Headline;