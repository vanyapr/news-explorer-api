const jwt = require('jsonwebtoken');
const UnauthorisedError = require('../errors/unauthorised');
const { JWT_SECRET = 'development_only_secret_key' } = process.env;
const User = require('../models/user');

const login = (req, res, next) => {
  const { email, password } = req.body;

  // Обратиться к бд и получить данные пользователя
  User.findUserByCredintials(email, password).then((user) => {
    const payload = { _id: user._id };
    // Создать JWT токен со сроком жизни в неделю
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