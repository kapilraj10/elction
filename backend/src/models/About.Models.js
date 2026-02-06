const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema(
  {
    vision: String,
    priorities: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    coverImage: String,
    coverTitle: String,
    coverDescription: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", AboutSchema);
