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

const updateCommentVotes = (inc_vote, comment_id) => {
  return db
    .query(
      `UPDATE comments
        SET votes = CASE WHEN (votes + $1) < 0 THEN 0
        ELSE votes + $1
        END
        WHERE comment_id = $2
        RETURNING *;`,
      [inc_vote, comment_id]
    )
    .then((updatedComment) => {
      return updatedComment.rows[0];
    });
};

module.exports = { deleteComment, addComment, updateCommentVotes };
