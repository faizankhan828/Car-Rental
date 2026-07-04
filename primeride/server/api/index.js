const serverless = require('serverless-http');
const app = require('../app');
const handler = serverless(app);
module.exports = (req, res) => handler(req, res);
