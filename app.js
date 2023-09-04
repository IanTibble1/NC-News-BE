const cors = require("cors");
const express = require("express");
app.use(cors());
const app = express();

const articlesRouter = require("./routers/articles-router");
const apiRouter = require("./routers/api-router");
const commentsRouter = require("./routers/comments-router");
const topicsRouter = require("./routers/topics-router");
const usersRouter = require("./routers/users-router");

app.use(express.json());
app.use("/api", apiRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

app.use((request, response, next) => {
  response.status(404).send({ msg: "No path found" });
  next();
});

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send(err);
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
  response.status(500).send({ err });
  next(err);
});
module.exports = app;
