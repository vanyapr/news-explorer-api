const NotFoundError = require('../errors/notFound');

const notfound = (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
};

module.exports = notfound;
