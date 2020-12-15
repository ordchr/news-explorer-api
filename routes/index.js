const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const users = require('./users');
const auth = require('../middlewares/auth');
const articles = require('./articles');
const { login, createUser } = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

router.use(auth);

router.use('/users', users);
router.use('/articles', articles);

module.exports = router;
