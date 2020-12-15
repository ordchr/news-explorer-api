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
  if (req.article.owner.toString() === req.user._id) {
    Article.findByIdAndRemove(req.article._id)
      .then((deletedCard) => res.status(200).send(deletedCard))
      .catch((err) => next(err));
  } else {
    next(new BadPermitionsError('Нельзя удалить статью другого пользователя'));
  }
};
