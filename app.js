const { errors, celebrate, Joi } = require('celebrate'); // Обработчик ошибок celebrate
const dotenv = require('dotenv'); // Модуль для работы с .env файлами
dotenv.config(); // Сконфигурировали модуль для работы с файлами .env
const express = require('express'); // Экспресс
const mongoose = require('mongoose'); // Работа с бд монго
const cors = require('cors'); // Модуль для решения проблемы с CORS
const bodyParser = require('body-parser'); // Body-parser для преобразования тела запроса
const { requestLogger, errorLogger } = require('./middlewares/logger'); // Логгер запросов и ошибок
const { PORT = 3000 } = process.env; // Переменные окружения - порт

// Роутеры
const articlesRouter = require('./routes/articles');
const usersRouter = require('./routes/users');
const notFound = require('./routes/notfound');

// Контроллеры авторизации и регистрации
const createUser = require('./controllers/createUser'); // Регистрация на сайте
const login = require('./controllers/login'); // Регистрация на сайте

// Мидллвэры
const authorise = require('./middlewares/authorise'); // Мидллвэр авторизации

// Объявили приложение экспресс
const app = express();

// Подключили модуль body-parser для json запросов
app.use(bodyParser.json());

// Подключили решение для CORS заголовков
app.use(cors());

// Подключились к базе данных
mongoose.connect('mongodb://localhost:27017/newsExplorer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Приложение слушает на порту 3000 (по умолчанию)
app.listen(PORT, () => {
  console.log(`App started. Listening at port ${PORT}`);
});

// Объявили логгер реквестов (до обработчиков реквестов)
app.use(requestLogger);

// Роутинг приложения
// Регистрация
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(5),
    password: Joi.string().required().min(5),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

// Вход
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(5),
    password: Joi.string().required().min(5),
  }),
}), login);

app.use('/', authorise, articlesRouter);
app.use('/', authorise, usersRouter);
app.use('/', authorise, notFound);

// Объявили логгер ошибок (после обработчиков реквестов и до обработчика ошибок)
app.use(errorLogger);

// Обработчик ошибок Celebrate (должен быть после роутеров, чтобы отловить ошибки)
app.use(errors());

// Обработчик ошибок в конце файла после других мидллвэров (чтобы отловить все ошибки)
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  // Если у ошибки статус 500 - отправляем стандартное сообщение об ошибке
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка на сервере' : message });
  next();
});
