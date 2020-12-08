const WrongDataError = require('../errors/wrongData'); // Ошибка "Неправильные данные"
const UnauthorisedError = require('../errors/unauthorised'); // Ошибка "Авторизуйтесь"
const NotFoundError = require('../errors/notFound'); // Ошибка "404"
const User = require('../models/user');

// Находит пользователя в базе данных по ID
const getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user })
    .then((userData) => {
      // Если юзер найден, вернём его данные
      res.send(userData);
    })
    .catch(next); // Передадим ошибку в централизованный обработчик
};

module.exports = {
  getUserInfo,
};
