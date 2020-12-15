const Article = require('../models/article');
const BadPermitionsError = require('../modules/exceptions/BadPermitionsError');

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.send(article))
    .catch((err) => next(err));
};

module.exports.getArticles = (req, res, next) => {
  const { _id } = req.user;
  Article.find({ owner: _id })
    .then((articles) => res.send(articles))
    .catch((err) => next(err));
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findOneAndDelete({ _id: req.article._id, owner: req.user._id })
    .then((article) => {
      if (!article) {
        next(new BadPermitionsError('Нельзя удалить статью другого пользователя'));
      } else {
        res.send(article);
      }
    })
    .catch((err) => next(err));
};
