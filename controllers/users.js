const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BadRequestError, NotFoundError, AlreadyExistsError, UnauthorizedError,
} = require('../modules/exceptions');
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
        next(new BadRequestError('Ошибочный формат id'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  User.create({
    name, email, password,
  })
    .then(({
      /* eslint no-shadow: 0 */
      name, email,
    }) => res.send({
      data: {
        name, email,
      },
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new AlreadyExistsError('Такой email уже зарегистрирован'));
      } else {
        next(err);
      }
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
