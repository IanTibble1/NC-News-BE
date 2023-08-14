const { fetchTopics } = require("../models/topic-models");

const getTopics = (request, response, next) => {
  response.status(200).send();
};

module.exports = { getTopics };
