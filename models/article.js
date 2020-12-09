const { model, Schema } = require('mongoose'); // Использовали деструктурирующее присваивание
const validator = require('validator'); // Модуль для валидации данных (имейл)
const UnauthorisedError = require('../errors/unauthorised'); // Ошибка "Авторизуйтесь"
const NotFoundError = require('../errors/notFound'); // Ошибка "404"

const articleSchema = new Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        // Проверяем url на соответствие шаблону URL адреса
        return validator.isURL(link, // Вторым аргументом передали объект опций
          {
            protocols: ['http', 'https', 'ftp'],
            require_tld: true, // Требуем доменную зону
            require_protocol: true, // Требуем указать протокол
            require_host: true, // Требуем указать хост
            require_valid_protocol: true, // Протокол должен быть валидным
            allow_underscores: false, // Запретить _ в урл
            host_whitelist: false,
            host_blacklist: false,
            allow_trailing_dot: false, // Запретить точку на конце протокола
            allow_protocol_relative_urls: false,
            disallow_auth: false, // Разрешить авторизацию
            validate_length: true, // Проверяем адрес на максимальную длину
          });
      },
      message: 'Введите корректный url адрес',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(image) {
        // Проверяем url на соответствие шаблону URL адреса
        return validator.isURL(image, // Вторым аргументом передали объект опций
          {
            protocols: ['http', 'https', 'ftp'],
            require_tld: true, // Требуем доменную зону
            require_protocol: true, // Требуем указать протокол
            require_host: true, // Требуем указать хост
            require_valid_protocol: true, // Протокол должен быть валидным
            allow_underscores: false, // Запретить _ в урл
            host_whitelist: false,
            host_blacklist: false,
            allow_trailing_dot: false, // Запретить точку на конце протокола
            allow_protocol_relative_urls: false,
            disallow_auth: false, // Разрешить авторизацию
            validate_length: true, // Проверяем адрес на максимальную длину
          });
      },
      message: 'Введите корректный url адрес',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false, // Запретили базе возвращать поле владельца напрямую
  },
});

// Статичный метод удаления статьи, удалит статью при наличии прав или вернёт реджект
// Эта функция не должна быть стрелочной, потому что стрелочные функции запоминают свой THIS
// А нам нужно чтобы this был привязан именно к схеме юзера, а не к месту вызова этого метода
articleSchema.statics.checkOwnerAndDelete = function (userId, articleId) {
  // Нашли в базе данных пользователя по email
  return this.findOne({ _id: articleId }).select('+owner').then((article) => {
    // Если такой статьи не существует, вернётся Null
    if (!article) {
      // Если статья не найдена, вернём реджект в блок catch снаружи
      return Promise.reject(new NotFoundError('Статья не найдена'));
    }

    // Если статья найдена, нужно сравнить идентификатор владельца с переданным идентификатором
    if (userId.toString() === article.owner.toString()) { // Так сравнивает корректно
      // Если идентификаторы совпали, можно удалить статью
      return this.findOneAndDelete({ _id: articleId }); // Удалили статью из базы и вернули промис
    }

    // Если статья найдена, но идентификаторы не совпали, вернём реджект "не авторизованый запрос"
    return Promise.reject(new UnauthorisedError('У вас нет прав на удаление этой статьи'));
  });
};

module.exports = model('article', articleSchema);
