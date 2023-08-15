const {
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
} = require("../models/article-models");

const getAllArticles = (request, response, next) => {
  fetchAllArticles().then((articles) => {
    response.status(200).send({ articles: articles });
  });
};

const getArticle = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticle(article_id)
    .then((article) => {
      response.status(200).send({ articles: article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleComments(article_id).then((comments) => {
    response.status(200).send({ comments });
  });
};

module.exports = { getArticle, getAllArticles, getArticleComments };
