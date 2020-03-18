const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortID = require("shortid");

const UrlSchema = new Schema(
  {
    fullUrl: {
      type: String,
      required: true
    },
    shortUrl: {
      type: String,
      required: true,
      default: shortID.generate
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("urlList", UrlSchema);
