const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
    default: '',
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/[.\w-]+\.\w+[\w-/]+#?/gm.test(v);
      },
      message: 'Wrong URL link',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/[.\w-]+\.\w+[\w-/]+#?/gm.test(v);
      },
      message: 'Wrong image URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
