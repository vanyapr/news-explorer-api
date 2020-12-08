const bcrypt = require('bcryptjs');
const WrongDataError = require('../errors/wrongData'); // Ошибка "Неправильные данные"
const User = require('../models/user');

// Создаёт пользователя в базе данных
const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((passwordHash) => User.create({ email, password: passwordHash, name }))
    .then((createdUser) => {
      res.send(createdUser);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new WrongDataError('Ошибка валидации - исправьте тело запроса'));
      } else if (error.name === 'MongoError') {
        // На боевых проектах так нельзя, но здесь я хочу отловить ошибку
        next(new WrongDataError('Ошибка валидации - email должен быть уникальным'));
      } else {
        next(error);
      }
    });
};

module.exports = createUser;
