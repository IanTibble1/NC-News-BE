const db = require("../db/connection");

const fetchUsers = () => {
  return db
    .query(
      `SELECT username, name, avatar_url
    FROM users`
    )
    .then((result) => {
      return result.rows;
    });
};

const fetchUser = (username) => {
  return db
    .query(
      `SELECT username, name, avatar_url
  FROM users
  WHERE username = $1`,
      [username]
    )
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = { fetchUsers, fetchUser };
