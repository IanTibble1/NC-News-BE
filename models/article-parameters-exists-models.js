const db = require("../db/connection");

const checkIdExists = (article_id) => {
  return db
    .query(
      `SELECT * 
  FROM articles 
  WHERE article_id =$1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `Article_id ${article_id} does not exist`,
        });
      }
    });
};

const checkUserNameExist = (username) => {
  return db
    .query(
      `SELECT *
   FROM users
   WHERE username = $1`,
      [username]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `Username ${username} does not exist`,
        });
      }
    });
};

const checkCommentIdExists = (comment_id) => {
  return db
    .query(
      `SELECT *
   FROM comments
   WHERE comment_id = $1`,
      [comment_id]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment with id ${comment_id} exists`,
        });
      }
    });
};

module.exports = { checkIdExists, checkUserNameExist, checkCommentIdExists };
