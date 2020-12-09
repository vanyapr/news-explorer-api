const jwt = require('jsonwebtoken'); // Модуль для работы с JWT
const UnauthorisedError = require('../errors/unauthorised'); // Ошибка "Не авторизован"
const { JWT_SECRET = 'development_only_secret_key' } = process.env; // Переменные окружения - секретный ключ
const User = require('../models/user'); // Модель юзера

const login = (req, res, next) => {
  // Получим данные из тела запроса
  const { email, password } = req.body;

  // Обратимся к бд и получим данные пользователя
  User.findUserByCredentials(email, password).then((user) => {
    const payload = { _id: user._id };
    // Создадим JWT токен со сроком жизни в неделю
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { // объект опций
        expiresIn: '7d', // Срок жизни токена, если не передать срок действия, токен не истечёт
      },
    );
    // В пейлоад записать _id пользователя
    res.send({ token });
  }).catch((error) => {
    // Передали ошибку по цепочке в обработчик, придав ошибке статус
    next(new UnauthorisedError(error.message));
  });
};

module.exports = login;
