const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { joiValidateUrl } = require('../modules/utils');

const {
  createArticle, getArticles, deleteArticle,
} = require('../controllers/articles');
const { populateArticle } = require('../modules/utils');

router.param('articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().length(24).hex(),
  }),
}));

router.param('articleId', populateArticle);

router.get('/', getArticles);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom(joiValidateUrl, 'validate link URL'),
    image: Joi.string().custom(joiValidateUrl, 'validate image URL'),
  }),
}), createArticle);

router.delete('/:articleId', deleteArticle);

module.exports = router;
