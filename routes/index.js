const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/user');
const { regexEmail } = require('../utils/regex');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).regex(regexEmail),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).regex(regexEmail),
    password: Joi.string().required(),
  }),
}), login);

module.exports = router;
