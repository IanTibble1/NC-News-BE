const express = require("express");
const app = express();
const { getApi } = require("./controllers/api-controllers");
const { getTopics } = require("./controllers/topic-controllers");
const { getArticle } = require("./controllers/article-controllers");
app.use(express.json());
app.get("/api/", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);

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
