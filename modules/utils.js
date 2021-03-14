const Article = require('../models/article');
const BadRequestError = require('./exceptions/BadRequestError');
const NotFoundError = require('./exceptions/NotFoundError');

const populateArticle = (req, res, next, articleId) => {
  Article.findById(articleId)
    .populate('owner')
    .then((article) => {
      if (article === null) {
        return next(new NotFoundError('Нет статьи с таким id'));
      }
      req.article = article;
      return next();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Ошибочный формат id'));
      }
      return next(err);
    });
};

const joiValidateUrl = (value) => {
  if (!/https?:\/\/[.\w-]+\.\w+[\w-/]+#?/gm.test(value)) {
    throw new Error('Wrong URL');
  }

  return value;
};

module.exports = {
  populateArticle,
  joiValidateUrl,
};
