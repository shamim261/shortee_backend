const mongoose = require("mongoose");

const urlSchema = mongoose.Schema(
  {
    mainURL: {
      type: String,
      required: true,
      trum: true,
      lowercase: true,
    },
    shortURL: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    visitedHistory: [
      {
        timestamp: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Url = mongoose.model("url", urlSchema);

module.exports = Url;
