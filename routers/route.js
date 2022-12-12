const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const auth = require("./../auth");

router.get("/", (req, res) => {
  res.json({
    message: "Hey! How are you !!",
  });
});

router.get("/free-endpoint", (req, res) => {
  res.json({ message: "You are free to access me " });
});

router.get("/auth-endpoint", auth, (req, res) => {
  res.json({ message: "You are authorized to access me" });
});

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
      });
      user
        .save()
        .then((result) => {
          res.status(201).send({
            message: "User created successfully",
            result,
          });
        })
        .catch((err) => {
          res.status(200).send({
            message: "Error creating user",
            err,
          });
        });
    })
    .catch((err) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        err,
      });
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return res.status(400).send({
              message: "Passwords does not much",
              error,
            });
          }
          const token = jwt.sign(user.toObject(), "RANDOM-TOKEN", {
            expiresIn: "24h",
          });

          res.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        .catch((err) => {
          res.status(400).send({
            message: "Passwords does not much",
            err,
          });
        });
    })
    .catch((err) => {
      res.status(404).send({
        message: "Email not found",
        err,
      });
    });
});

module.exports = router;
