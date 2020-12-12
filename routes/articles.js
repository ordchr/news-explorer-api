const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { joiValidateUrl } = require('../modules/utils');

const {
  createArticle, getArticles, deleteArticle,
} = require('../controllers/articles');
const { populateArticle } = require('../modules/utils');

router.param('articleId', populateArticle);

router.get('/', getArticles);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().min(2).max(50).required(),
    title: Joi.string().min(2).max(100).required(),
    text: Joi.string().min(2).required(),
    date: Joi.date().required(),
    source: Joi.string().custom(joiValidateUrl, 'validate source URL'),
    link: Joi.string().custom(joiValidateUrl, 'validate link URL'),
    image: Joi.string().custom(joiValidateUrl, 'validate image URL'),
  }),
}), createArticle);

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().length(24).hex(),
  }),
}), deleteArticle);

module.exports = router;
