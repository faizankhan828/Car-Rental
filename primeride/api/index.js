const serverless = require('serverless-http');
const { app } = require('../server/app');

const handler = serverless(app);

module.exports = async (req, res) => {
  return handler(req, res);
};
