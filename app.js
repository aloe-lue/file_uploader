const express = require("express");
const app = express();
require("dotenv").config();
const path = require("node:path");

// routes
const homeRouter = require("./routes/homeRouter/homeRouter");
const logInRouter = require("./routes/logInRouter/logInRouter");
const logOutRouter = require("./routes/logOutRouter/logOutRouter");
const folderRouter = require("./routes/folderRouter/folderRouter");

// views config
const viewpath = path.join(__dirname, "views");
app.set("view engine", "ejs");
app.set("views", viewpath);

// body urlencoded
app.use(express.urlencoded({ extended: false }));

// public
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// session packages
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

// prisma store
const prismaSessionStore = new PrismaSessionStore(new PrismaClient(), {
  checkPeriod: 2 * 60 * 1000, //ms
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

const expressSession = session({
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // ms
  },
  secret: process.env.SECRET_HEHE,
  resave: true,
  saveUninitialized: false,
  store: prismaSessionStore,
});
const passport = require("passport");
const localStrategy = require("./config/localStrategy/localStrategy");

app.use(expressSession);
app.use(passport.session());
passport.use(localStrategy.localStrategy);
passport.serializeUser(localStrategy.serializer);
passport.deserializeUser(localStrategy.deserializer);

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // console.log(req.session.message);
  next();
});

// groups routes
app.use("/", homeRouter);
app.use("/log-in", logInRouter);
app.use("/log-out", logOutRouter);
app.use("/folder", folderRouter);

app.get((error, req, res, next) => {
  console.error(err);

  res.status(500).send("SEMETHENG WENT WRENG!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is running at port ${PORT}`);
});
