const { checkIdExists } = require("../models/article-id-models");

const {
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
} = require("../models/article-models");

const getAllArticles = (request, response, next) => {
  fetchAllArticles()
    .then((articles) => {
      response.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
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
  const promises = [fetchArticleComments(article_id)];

  if (article_id) {
    promises.push(checkIdExists(article_id));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticle, getAllArticles, getArticleComments };
