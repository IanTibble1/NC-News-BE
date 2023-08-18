const { checkIdExists } = require("../models/article-parameters-exists-models");

const {
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
  updateVotes,
} = require("../models/article-models");
const articles = require("../db/data/test-data/articles");

const getAllArticles = (request, response, next) => {
  const query = request.query;

  fetchAllArticles(query)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticle = (request, response, next) => {
  const { article_id } = request.params;

  checkIdExists(article_id)
    .then(() => {
      return fetchArticle(article_id);
    })
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

const updateArticle = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_vote } = request.body;

  if (inc_vote === undefined) {
    return response.status(400).send({ msg: "required field missing" });
  } else if (typeof inc_vote !== "number") {
    return response.status(400).send({ msg: "votes should be a number" });
  }

  checkIdExists(article_id)
    .then(() => {
      updateVotes(article_id, inc_vote).then((updatedArticle) => {
        response.status(200).send({ updatedArticle });
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticle,
  getAllArticles,
  getArticleComments,
  updateArticle,
};
