const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, updateUser } = require('../controllers/user');
const { regexEmail } = require('../utils/regex');

router.get('/users/me', getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).regex(regexEmail),
    name: Joi.string().min(2).max(30),
  }),
}), updateUser);

module.exports = router;
