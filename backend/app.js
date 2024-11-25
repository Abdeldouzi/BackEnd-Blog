require("dotenv").config();
require("./models/connection");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var articlesRouter = require("./routes/articles");

var app = express();

// Configuration CORS pour autoriser les requêtes provenant du frontend
app.use(cors());

// Utilisation des autres middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Définition des routes
app.use("/users", usersRouter);
app.use("/articles", articlesRouter);
app.use("/", indexRouter);

module.exports = app;
