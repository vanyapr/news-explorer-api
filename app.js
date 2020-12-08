const express = require('express'); // Экспресс
const mongoose = require('mongoose'); // Работа с бд монго
const dotenv = require('dotenv'); // Модуль для работы с .env файлами
const bodyParser = require('body-parser'); // Body-parser для преобразования тела запроса
const { PORT = 3000 } = process.env;

// Объявили приложение экспресс
const app = express();

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

app.use('/', (req, res) => {
  res.send('Hello, world');
});
