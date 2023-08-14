const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topic-controllers");

app.use(express.json());
app.get("/api/topics", getTopics);

app.use((request, response, next) => {
  response.status(404).send({ msg: "page not found" });
  next();
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ err });
  next();
});
module.exports = app;
