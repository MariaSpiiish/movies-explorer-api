const mongoose = require('mongoose');
const validator = require('validator');
const BadRequest = require('../custom errors/BadRequest');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new BadRequest('Введите ссылку');
      }
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new BadRequest('Введите ссылку');
      }
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new BadRequest('Введите ссылку');
      }
    },
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
