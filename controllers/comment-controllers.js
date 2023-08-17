const { deleteComment, addComment } = require("../models/comment-models");
const {
  checkCommentIdExists,
  checkIdExists,
  checkUserNameExist,
} = require("../models/article-parameters-exists-models");

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

const removeComment = (request, response, next) => {
  const { comment_id } = request.params;

  checkCommentIdExists(comment_id)
    .then(() => {
      return deleteComment(comment_id);
    })
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { removeComment, postComment };
