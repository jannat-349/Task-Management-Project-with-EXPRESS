const express = require("express");
const app = express();
const port = 6000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ msg: "app successful" });
});


app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
