const { fetchTopics } = require("../models/topic-models");

const getTopics = (request, response, next) => {
  console.log(response);
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics };
