const { model, Schema } = require('mongoose'); // Использовали деструктурирующее присваивание
const validator = require('validator'); // Модуль для валидации данных (имейл)

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

// Статичный метод проверки прав на удаление, вернёт true если права есть, или false если прав нет
// Эта функция не должна быть стрелочной, потому что стрелочные функции запоминают свой THIS
// А нам нужно чтобы this был привязан именно к схеме юзера, а не к месту вызова этого метода
articleSchema.statics.checkOwner = function (userId, articleId) {
  // Нашли в базе данных пользователя по email
  return this.findOne({ _id: articleId }).select('+owner').then((article) => {
    // Если такой статьи не существует, вернётся Null
    if (!article) {
      // Если статья не найдена, вероятно у нас на сервере ошибка,
      // ведь мы попали в этот блок из уже найденной статьи
      return Promise.reject(new Error('Ошибка на сервере'));
    }

    // Если статья найдена, нужно сравнить идентификатор владельца с переданным идентификатором
    if (userId.toString() === article.owner.toString()) { // Так сравнивает корректно
      // Если идентификаторы совпали, вернём true
      return true;
    }

    // Если статья найдена, но идентификаторы не совпали, false
    return false;
  });
};

module.exports = model('article', articleSchema);
