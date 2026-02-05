const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: 
    {
         type: String, 
         required: true },
    content: { 
        type: String, 
        required: true },
    category: { 
        type: String,
         default: "Education" },
    date: 
    { type: String, 
        required: true },

    images: [
      {
        url: String,
        isPrimary: { type: Boolean,
             default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
