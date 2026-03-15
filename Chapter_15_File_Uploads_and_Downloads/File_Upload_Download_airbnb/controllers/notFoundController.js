const path = require("path");
const rootDir = require('../utils/path-util')

const useNotFoundPage = (req, res, next) => {
  res.status(404).render('error/404', { pageTitle: 'Not Found' });
}

module.exports = {
    useNotFoundPage
}