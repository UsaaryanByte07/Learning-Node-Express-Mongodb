const path = require("path");
const rootDir = require('../utils/path-util')

const useNotFoundPage = (req, res, next) => {
  req.statusCode = 404;
  res.render('error/404',{pageTitle: 'Not Found'})
}

module.exports = {
    useNotFoundPage
}