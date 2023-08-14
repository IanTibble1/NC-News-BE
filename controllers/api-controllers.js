const apiList = require("../endpoints.json");
const getApi = (request, response, next) => {
  response.status(200).send(apiList);
};

module.exports = { getApi };
