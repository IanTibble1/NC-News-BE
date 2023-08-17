const db = require("../db/connection");

const fetchUsers = () => {
  return db.query(`SELECT username, name, avatar_url
    FROM users`);
};

module.exports = { fetchUsers };
