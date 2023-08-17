const db = require("../db/connection");

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

const deleteComment = (comment_id) => {
  return db.query(
    `DELETE FROM comments
    WHERE comment_id = $1`,
    [comment_id]
  );
};

module.exports = { deleteComment, addComment };
