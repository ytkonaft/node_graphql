const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, resp, next) => {
  resp.send("Hello");
});

app.listen(3000);
