const serverless = require('serverless-http');
const { app, ready } = require('../app');
const handler = serverless(app);
module.exports = async (req, res) => {
  await ready;
  return handler(req, res);
};
