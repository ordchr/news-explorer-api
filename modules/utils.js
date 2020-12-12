const Article = require('../models/article');

const populateArticle = (req, res, next, articleId) => Article.findById(articleId)
  .then((article) => {
    if (article === null) {
      res.status(404).send({ message: 'Нет статьи с таким id' });
    } else {
      req.article = article;
      next();
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Ошибочный формат id' });
    }
    next(err);
  });

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
