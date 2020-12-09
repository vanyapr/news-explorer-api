const User = require('../models/user');

// Находит пользователя в базе данных по ID
const getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((userData) => {
      // Если юзер найден, вернём его данные
      res.send(userData);
    })
    .catch(next); // Передадим ошибку в централизованный обработчик
};

module.exports = {
  getUserInfo,
};
