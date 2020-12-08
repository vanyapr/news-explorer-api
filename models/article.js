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
        return validator.isURL(link);
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
