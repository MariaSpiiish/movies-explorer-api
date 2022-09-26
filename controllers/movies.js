const Movie = require('../models/movie');
const NotFound = require('../custom errors/NotFound');
const {
  ok, created,
} = require('../custom errors/error_status');
const BadRequest = require('../custom errors/BadRequest');
const Forbidden = require('../custom errors/Forbidden');

const getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.status(ok).send(movies))
  .catch(next);

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(created).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при создании фильма'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => Movie.findById(req.params.movieId)
  .orFail(() => {
    throw new NotFound('Фильм не найден');
  })
  .then((movie) => {
    if (movie.owner.toString() !== req.user._id) {
      return next(new Forbidden('Нельзя удалить чужой фильм'));
    }
    return movie.remove()
      .then(() => res.status(ok).send({ message: 'Фильм удален' }));
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequest('Переданы некорректные данные при удалении фильма'));
    }
    return next(err);
  });

module.exports = {
  getMovies, createMovie, deleteMovie,
};
