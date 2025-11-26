const express = require("express");
const cors = require("cors");
const router = require("./routes/router.js");
const bodyParser = require("body-parser");
var session = require("express-session");
const path = require("path");

const server = express();

server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));

// server.use(
//   cors({
//     origin: "http://localhost:3000", // đổi theo FE của bạn
//     credentials: true,
//   })
// );

server.use(bodyParser.json());

// server.use(
//   session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false,
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   })
// );

const port = 8888;

server.use("/", router);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
