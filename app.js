const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const morgan = require("morgan");

//Routers
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(morgan("dev"));

// static folder
app.use(express.static("views/resources"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// set view engine
app.set("view engine", "ejs");

// set up session cookies
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(
  keys.mongodb.dbURI,
  { useNewUrlParser: true },
  () => {
    console.log("Live @ MongoDb as well!");
  }
);

app.use("/user", userRoutes);

// create home route
app.get("/", (req, res) => {
  res.render("pages/home", { user: req.user });
});

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });

app.listen(8080, () => {
  console.log("We are live @ :8080");
});
