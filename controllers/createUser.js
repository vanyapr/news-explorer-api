const bcrypt = require('bcryptjs');
const WrongDataError = require('../errors/wrongData'); // Ошибка "Неправильные данные"
const User = require('../models/user');

// Создаёт пользователя в базе данных
const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10) // Захешировали пароль
    // Создали пользователя с хешем пароля вместо самого пароля
    .then((passwordHash) => User.create({ email, password: passwordHash, name }))
    .then((createdUser) => {
      // Пересоберём ответ, чтобы не отправлять обратно хеш пароля
      const responce = {
        _id: createdUser._id,
        email: createdUser.email,
        name: createdUser.name,
      };
      // Вернули пересобранный ответ без хеша пароля
      res.send(responce); // Вернули данные вновь созданного пользователя
    })
    .catch((error) => { // Отловили ошибки
      // Если это ошибка валидации, сгенерируем соответствующую ошибку
      if (error.name === 'ValidationError') {
        next(new WrongDataError('Ошибка валидации - исправьте тело запроса'));
      } else if (error.name === 'MongoError') {
        // На боевых проектах так нельзя, но здесь я хочу отловить ошибку более явно
        next(new WrongDataError('Такой пользователь уже есть'));
      } else {
        // Другие ошибки попадут в централизованный обработчик ошибок со статусом 500
        next(error);
      }
    });
};

module.exports = createUser;
