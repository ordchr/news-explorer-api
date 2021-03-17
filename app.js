const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');

const { PORT = 3001 } = process.env;
const { MONGODB_URL = 'mongodb://localhost:27017/newsdb' } = process.env;

const index = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./modules/exceptions/NotFoundError');

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(requestLogger);

app.use('/', index);

app.use((req, res, next) => {
  next(new NotFoundError('404 Not found'));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);
