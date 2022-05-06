const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const HttpError = require("./models/error");
const morgan = require("morgan");

// Importing routes
const userRoutes = require("./routes/user.routes");

// Firebase dependencies
const { initializeApp } = require("firebase/app");

// Initializing express app
const app = express();
dotenv.config();

// Firebase initialization
const firebaseConfig = {
  apiKey: process.env.FIREBASEKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGE,
  messagingSenderId: process.env.SENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENTID,
};

const firebaseApp = initializeApp(firebaseConfig);

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// CORS Rules Modification
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.get("/", (req, res, next) => {
  res.send("Hello");
});

app.use("/api/users", userRoutes);

// Invalid route error
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// Connecting to db and running the server
mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(8000, () => {
      console.log(`Server is up and running on port 8000`);
    });
  })
  .catch((err) => {
    console.log("An error occurred : " + err.message);
  });
