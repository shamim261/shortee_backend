const express = require("express");
const { checkLogin } = require("../middlewares/common/checkLogin");
const Url = require("../models/urlSchema");
const User = require("../models/usersSchema");
const shortlink = require("shortlink");

const router = express.Router();

// create url

router.post("/", checkLogin, async (req, res, next) => {
  let genUrl = shortlink.generate(6);

  try {
    const newUrl = new Url({
      mainURL: req.body.url,
      shortURL: genUrl,
      userId: req.user.id,
      visitedHistory: [],
    });

    let result = await newUrl.save();

    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $push: {
          urls: {
            ...result,
          },
        },
      }
    );

    res.status(200).send({ success: "URL Created Successfully!" });
  } catch (err) {
    res.status(401).send({ message: "Something went wrong!" });
  }
});

// show url

router.get("/", checkLogin, async (req, res, next) => {
  try {
    const result = await User.findOne({ _id: req.user.id });

    res.status(200).send(result.urls);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong!" });
  }
});

// delete url

router.delete("/:shortURL", checkLogin, async (req, res) => {
  try {
    const result = await Url.findOneAndDelete({
      shortURL: req.params.shortURL,
    });

    const user = await User.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $pull: {
          urls: {
            _id: result._id,
          },
        },
      }
    );

    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

// redirect

router.get("/r/:shortUrl", async (req, res) => {
  // http://localhost:3100/edhtsk
  try {
    const isExist = await Url.findOne({
      shortURL: req.params.shortUrl,
    });

    if (isExist) {
      const result = await Url.findOneAndUpdate(
        {
          shortURL: req.params.shortUrl,
        },
        {
          $push: {
            visitedHistory: { timestamp: Date.now() },
          },
        }
      );
      // update in user document
      const user = await User.updateOne(
        {
          "urls.shortURL": req.params.shortUrl,
        },
        {
          $push: {
            "urls.$.visitedHistory": { timestamp: Date.now() },
          },
        }
      );

      res.status(200).send(result);
    } else {
      res.send({
        error: "URL not Found!",
      });
    }
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});

module.exports = router;
