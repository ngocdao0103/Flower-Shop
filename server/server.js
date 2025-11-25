const express = require("express");
const cors = require("cors");
const router = require("./routes/router.js");
const bodyParser = require("body-parser");

const server = express();

server.use(cors());
server.use(bodyParser.json());

const port = 3000;

server.use("/", router);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
