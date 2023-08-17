const db = require("../db/connection");

const fetchAllArticles = (topic) => {
  const acceptedTopics = ["mitch", "cats", "paper"];
  const queryValues = [];

  let baseStr = `SELECT 
  articles.author, articles.title, articles.article_id, articles.topic,
  articles.created_at,articles.votes,articles.article_img_url,
  COUNT(comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (!acceptedTopics.includes(topic) && topic !== undefined) {
    return Promise.reject({ status: 400, msg: "not a valid topic" });
  }

  if (topic) {
    baseStr += ` WHERE topic =$1`;
    queryValues.push(topic);
  }

  baseStr += ` GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;

  return db.query(baseStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

const fetchArticle = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
    WHERE article_id = $1`,
      [article_id]
    )
    .then((articles) => {
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

const fetchArticleComments = (article_id) => {
  return db.query(
    `SELECT comment_id, votes, created_at, author, body, article_id 
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC`,
    [article_id]
  );
};

const addComment = (username, commentBody, article_id) => {
  return db
    .query(
      `INSERT INTO comments(author, body, article_id)
  VALUES ($1, $2, $3) RETURNING *;`,
      [username, commentBody, article_id]
    )
    .then((comment) => {
      return comment.rows[0];
    });
};

const updateVotes = (article_id, inc_vote) => {
  return db
    .query(
      `UPDATE articles
  SET votes = CASE WHEN (votes + $1) < 0 THEN 0
  ELSE votes + $1
  END
  WHERE article_id = $2
  RETURNING *;`,
      [inc_vote, article_id]
    )
    .then((updatedArticle) => {
      return updatedArticle.rows[0];
    });
};

module.exports = {
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
  addComment,
  updateVotes,
};
