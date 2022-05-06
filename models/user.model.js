const mongoose = require("mongoose");
const validator = require("validator");
const HttpError = require("../models/error");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new HttpError("Name cannot be empty", 422);
      }
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new HttpError("Invalid Email Address", 422);
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new HttpError("Password cannot be empty", 422);
      }
    },
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
    default: "Male",
  },
  age: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 18) {
        throw new HttpError(
          "You must be above 18 years of age to register.",
          422
        );
      }
    },
  },
  address: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new HttpError("Address cannot be empty", 422);
      }
    },
  },
  city: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new HttpError("City cannot be empty", 422);
      }
    },
  },
  state: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new HttpError("State cannot be empty", 422);
      }
    },
  },
  zip: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new HttpError("ZIP cannot be empty", 422);
      }
    },
  },
  imageUrl: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new HttpError("Image cannot be empty", 422);
      }
    },
  },
});

module.exports = mongoose.model("User", userSchema);
