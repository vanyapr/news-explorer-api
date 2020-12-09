const dotenv = require('dotenv'); // Модуль для работы с .env файлами
dotenv.config(); // Сконфигурировали модуль для работы с файлами .env
const express = require('express'); // Экспресс
const mongoose = require('mongoose'); // Работа с бд монго
const cors = require('cors'); // Модуль для решения проблемы с CORS
const bodyParser = require('body-parser'); // Body-parser для преобразования тела запроса
const { PORT = 3000 } = process.env;

// Роутеры
const articlesRouter = require('./routes/articles');
const usersRouter = require('./routes/users');

// Контроллеры авторизации и регистрации
const createUser = require('./controllers/createUser'); // Регистрация на сайте
const login = require('./controllers/login'); // Регистрация на сайте

// Мидллвэры
const authorise = require('./middlewares/authorise'); // Мидллвэр авторизации

// Объявили приложение экспресс
const app = express();

// Подключили модуль body-parser для json запросов
app.use(bodyParser.json());

// Подключили решение для CORS заголосков
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

// Роутинг приложения
app.use('/signup', createUser);
app.use('/signin', login);
app.use('/', authorise, articlesRouter);
app.use('/', authorise, usersRouter);

// Обработчик ошибок в конце файла после других мидллвэров (чтобы отловить все ошибки)
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  // Если у ошибки статус 500 - отправляем стандартное сообщение об ошибке
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка на сервере' : message });
  next();
});
