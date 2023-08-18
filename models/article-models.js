const db = require("../db/connection");

const fetchAllArticles = ({
  topic,
  sort_by = "created_at",
  order = "DESC",
}) => {
  const acceptedTopics = ["mitch", "cats", "paper"];
  const acceptedSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const acceptedOrder = ["asc", "ASC", "desc", "DESC"];
  const queryValues = [];

  const orderToCaps = order.toUpperCase();

  let baseStr = `SELECT 
  articles.author, articles.title, articles.article_id, articles.topic,
  articles.created_at,articles.votes,articles.article_img_url,
  COUNT(comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (!acceptedTopics.includes(topic) && topic !== undefined) {
    return Promise.reject({ status: 404, msg: "topic does not exist" });
  }

  if (topic) {
    baseStr += ` WHERE topic =$1`;
    queryValues.push(topic);
  }

  baseStr += ` GROUP BY articles.article_id`;

  if (!acceptedSortBy.includes(sort_by) && sort_by !== undefined) {
    return Promise.reject({ status: 400, msg: "can't sort by that method" });
  }

  if (sort_by) {
    baseStr += ` ORDER BY ${sort_by}`;
  }

  if (!acceptedOrder.includes(order) && order !== undefined) {
    return Promise.reject({
      status: 400,
      msg: "invalid order only accepts asc(ascending) or desc (descending)",
    });
  }

  if (order) {
    baseStr += ` ${orderToCaps}`;
  }

  return db.query(baseStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

const fetchArticle = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`,
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
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id 
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
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
