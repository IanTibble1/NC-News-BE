const { deleteComment } = require("../models/comment-models");
const {
  checkCommentIdExists,
} = require("../models/article-parameters-exists-models");

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

module.exports = { removeComment };
