const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topic-controllers");

app.get("/api/topics", getTopics);

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ err });
  next();
});
module.exports = app;
