const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET = '70dee671c0f7f50d9d9c8faff790f88b359e788b130f2d6d81ba2436e445c532' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();

  return false;
};
