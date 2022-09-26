const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../custom errors/NotFound');
const BadRequest = require('../custom errors/BadRequest');
const DuplicateError = require('../custom errors/DuplicateError');
const UnauthorizedError = require('../custom errors/UnauthorizedError');
const { ok, created } = require('../custom errors/error_status');

const getUser = (req, res, next) => User.findById(req.user)
  .orFail(() => {
    throw new NotFound('Пользователь не найден');
  })
  .then((user) => res.status(ok).send(user))
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequest('Переданы некорректные данные при обновлении данных пользователя'));
    }
    return next(err);
  });

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.status(ok).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении данных пользователя'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => res.status(created).send({
      user: {
        name, email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new DuplicateError());
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(ok).send({ token });
    })
    .catch(() => next(new UnauthorizedError('Необходима авторизация')));
};

module.exports = {
  getUser, updateUser, createUser, login,
};
