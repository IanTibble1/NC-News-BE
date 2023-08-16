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
        return Promise.reject({ status: 404, msg: "Not found" });
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
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

module.exports = { checkIdExists, checkUserNameExist };
