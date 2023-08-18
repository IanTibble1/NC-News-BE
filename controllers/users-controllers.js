const {
  checkUserNameExist,
} = require("../models/article-parameters-exists-models");
const { fetchUsers, fetchUser } = require("../models/users-models");

const getAllUsers = (request, response, next) => {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (request, response, next) => {
  const { username } = request.params;

  checkUserNameExist(username)
    .then(() => {
      return fetchUser(username);
    })
    .then((username) => {
      response.status(200).send({ username });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getAllUsers, getUser };
