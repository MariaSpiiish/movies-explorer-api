require('dotenv').config();

const { NODE_ENV, DATA_BASE } = process.env;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = require('./utils/limiter');
const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const authRouter = require('./routes/index');
const { auth } = require('./middlewares/auth');

const errorHandler = require('./middlewares/errorHandler');
const NotFound = require('./custom errors/NotFound');

// Слушаем 3000 порт
const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

const options = {
  origin: [
    'http://localhost:3000',
    'https://movies-explorer.mlaps.nomoredomains.icu',
    'http://movies-explorer.mlaps.nomoredomains.icu',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

app.use(express.json());

app.use(requestLogger);

app.use(limiter);

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
