require('dotenv').config();

const { JWT_SECRET = '70dee671c0f7f50d9d9c8faff790f88b359e788b130f2d6d81ba2436e445c532' } = process.env;

module.exports = Object.freeze({
  JWT_SECRET,
});
