const express = require("express");
const route = express();
const db = require("../model/db");
const Url = require("../model/url");
const mongoose = require("mongoose");
const color = require("colors");

mongoose.connect(
  db,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log(color.red("Connected!"));
  }
);

route.get("/", async (req, res) => {
  const URL = await Url.find();
  res.render("index", {
    title: "Url Shortner",
    url: "",
    error: "",
    urls: URL
  });
});

route.post("/", async (req, res) => {
  const URL = await Url.find();
  const url = req.body.url;
  if (url !== "") {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    const validate = pattern.test(url);

    if (validate) {
      const present = await Url.findOne({ fullUrl: url });
      if (present) {
        res.render("index", {
          title: "Url Shortner",
          url: "",
          error: "This URL Already Shorten ! ",
          urls: URL
        });
      } else {
        const URL = new Url({ fullUrl: url });

        URL.save()
          .then(() => {
            res.render("index", {
              title: "Url Shortner",
              url: "",
              error: "URL Is Shortened ",
              urls: []
            });
          })
          .catch(err => {
            if (err) throw err;
          });
      }
    } else {
      res.render("index", {
        title: "Url Shortner",
        url: "",
        error: "Invalid URL! ",
        urls: URL
      });
    }
  } else {
    res.render("index", {
      title: "Url Shortner",
      url: "",
      error: "Fill The Url Field *",
      urls: URL
    });
  }
});

route.get("/:url", async (req, res) => {
  const URL = await Url.find();
  const url = req.params.url;

  Url.findOne({ shortUrl: url })
    .then(data => {
      const fullURl = data.fullUrl;
      res.redirect(fullURl);
    })
    .catch(err => {
      if (err) {
        res.render("index", {
          title: "Url Shortner",
          url: "",
          error: "Shortened URL Is Invalid! ",
          urls: URL
        });
      }
    });
});

route.post("/:url", async (req, res) => {
  const URL = await Url.find();
  const url = req.params.url;

  Url.deleteOne({ shortUrl: url })
    .then(()=> {
      res.render("index", {
        title: "Url Shortner",
        url: "",
        error: "URL Deleted! ",
        urls: []
      });
    })
    .catch(err => {
      if (err) {
        res.render("index", {
          title: "Url Shortner",
          url: "",
          error: "URL Cannot Deleted! ",
          urls: URL
        });
      }
    });
});

module.exports = route;
