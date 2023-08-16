const {
  checkIdExists,
  checkUserNameExist,
} = require("../models/article-parameters-exists-models");

const {
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
  addComment,
  updateVotes,
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

const postComment = (request, response, next) => {
  const { body } = request.body;
  const { username } = request.body;
  const { article_id } = request.params;
  if (body === undefined || username === undefined) {
    response.status(400).send({ msg: "missing required field" });
  }

  Promise.all([checkIdExists(article_id), checkUserNameExist(username)])
    .then(() => {
      return addComment(username, body, article_id);
    })
    .then((comments) => {
      response.status(201).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const updateArticle = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_vote } = request.body;

  checkIdExists(article_id).then(() => {
    updateVotes(article_id, inc_vote).then((updatedArticle) => {
      response.status(200).send({ updatedArticle });
    });
  });
};

module.exports = {
  getArticle,
  getAllArticles,
  getArticleComments,
  postComment,
  updateArticle,
};
