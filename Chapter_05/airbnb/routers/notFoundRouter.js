const path = require("path");
const express = require("express");
const rootDir = require('../utils/path-util')

const notFoundRouter = express.Router();

notFoundRouter.use((req, res, next) => {
  req.statusCode = 404;
  res.sendFile(path.join(rootDir,'views','404.html'));
});
module.exports = notFoundRouter;
