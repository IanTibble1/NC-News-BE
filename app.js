const express = require("express");
const app = express();
const { getApi } = require("./controllers/api-controllers");
const { getTopics } = require("./controllers/topic-controllers");
const {
  getArticle,
  getAllArticles,
  getArticleComments,
  postComment,
} = require("./controllers/article-controllers");

app.use(express.json());

app.get("/api/", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postComment);

app.use((request, response, next) => {
  response.status(404).send({ msg: "No path found" });
  next();
});

app.use((err, request, response, next) => {
  if (err.status === 404) {
    response.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ err });
  next(err);
});
module.exports = app;
