require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const authRouter = require('./routes/index');
const { auth } = require('./middlewares/auth');

const errorHandler = require('./middlewares/errorHandler');
const NotFound = require('./custom errors/NotFound');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(requestLogger);

app.use('/', authRouter);
app.use(auth);
app.use('/', userRouter);
app.use('/', moviesRouter);

app.use((req, res, next) => {
  next(new NotFound('404 Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
