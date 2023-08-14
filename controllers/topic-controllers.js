const { fetchTopics } = require("../models/topic-models");

const getTopics = (request, response, next) => {
  fetchTopics()
    .then((rows) => {
      response.status(200).send({ topics: rows });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics };
