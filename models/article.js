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
        return validator.isURL(link);
      },
      message: 'Введите корректный url адрес',
    },
  },
  image: {
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
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false, // Запретили базе возвращать поле владельца напрямую
  },
});

module.exports = model('article', articleSchema);
