const { model, Schema } = require('mongoose'); // Использовали деструктурирующее присваивание
const validator = require('validator'); // Модуль для валидации данных (имейл)
const bcrypt = require('bcryptjs'); // Модуль для работы с зашифрованными данными (хешем пароля)

// Объявили модель пользователя
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5, // Имейл не может быть короче 5 символов: a@b.c
    validate: {
      validator(email) {
        // Проверяем имейл на соответствие шаблону имейла
        return validator.isEmail(email);
      },
      message: 'Введите корректный адрес электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 5, // Установили минимальную длину пароля в 5 символов
    select: false, // Запретили базе возвращать это поле
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// Эта функция не должна быть стрелочной, потому что стрелочные функции запоминают свой THIS
// А нам нужно чтобы this был привязан именно к схеме юзера, а не к месту вызова этого метода
userSchema.statics.findUserByCredentials = function (email, password) {
  // Нашли в базе данных пользователя по email
  return this.findOne({ email }).select('+password').then((user) => {
    // Если такого юзера нет, вернётся Null
    if (!user) {
      // Если юзер не найден, вернём реджект в блок catch снаружи
      return Promise.reject(new Error('Неправильные имя пользователя или пароль'));
    }

    // Если юзер есть, нужно сравнить хеши паролей
    return bcrypt.compare(password, user.password).then((passwordsMatch) => {
      // Если пароли не совпали, передаем реджект в блок catch снаружи
      if (!passwordsMatch) {
        // Не забываем возвращать реджект промисов
        return Promise.reject(new Error('Неправильные имя пользователя или пароль'));
      }

      // Если пароли совпали, вернули объект юзера
      return user;
    });
  });
};

// Экспортировали модель пользователя
module.exports = model('user', userSchema);
