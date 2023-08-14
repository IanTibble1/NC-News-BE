const db = require("../db/connection");

const fetchArticle = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
    WHERE article_id = $1`,
      [article_id]
    )
    .then((articles) => {
      console.log(articles);
      if (articles.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      } else {
        return articles.rows[0];
      }
    });
};

module.exports = { fetchArticle };
