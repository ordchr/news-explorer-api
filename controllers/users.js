const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../modules/exceptions/BadRequestError');
const NotFoundError = require('../modules/exceptions/NotFoundError');
const AlreadyExistsError = require('../modules/exceptions/AlreadyExistsError');
const UnauthorizedError = require('../modules/exceptions/UnauthorizedError');
const { JWT_SECRET } = require('../modules/constant');

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Ошибочный формат id'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  User.create({
    name, email, password,
  })
    .then((user) => res.send({
      data: {
        name: user.name,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        return next(new AlreadyExistsError('Такой email уже зарегистрирован'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const jwtToken = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token: jwtToken });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};
