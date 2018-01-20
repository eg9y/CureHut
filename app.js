const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("HELLO DER");
});

app.listen(3000, () => {
  console.log("server running at port 3000");
});
