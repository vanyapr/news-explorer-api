const WrongDataError = require('../errors/wrongData'); // Ошибка "Неправильные данные"
const UnauthorisedError = require('../errors/unauthorised'); // Ошибка "Авторизуйтесь"
const NotFoundError = require('../errors/notFound'); // Ошибка "404"
const Article = require('../models/article');

// Возвращает массив сохранённых пользователем статей
const getAllMyArticles = (req, res, next) => {
  // Объявили владельца статьи для удобочитаемости кода
  const owner = req.user._id;

  // Нашли в базе данных все статьи этого владельца
  Article.find({ owner })
    .then((articlesList) => {
      // Вернёт все статьи из базы, либо пустой массив, если статей этого юзера в базе нет
      res.send(articlesList);
    }).catch(next); // В случае ошибки передали её в централизованный обработчик ошибок
};

// Создаёт статью в базе данных
const createArticle = (req, res, next) => {
  // Объявили владельца статьи для удобочитаемости кода
  const owner = req.user._id;

  // Получили данные из запроса
  const { keyword, title, text, date, source, link, image } = req.body;

  // Записали данные в базу данных
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner, // Передали владельца (авторизованного юзера)
  }).then((createdArticle) => {
    res.send(createdArticle);
  }).catch((error) => {
    console.log(error);
    if (error.name === 'ValidationError') {
      // Если это ошибка валидации данных, надо сообщить об этом
      next(new WrongDataError('Ошибка валидации данных'));
    } else {
      next(error);
    }
  });
};

// Удаляет статью по её ID
const deleteArticle = (req, res, next) => {
  // Объявили текущего юзера для удобочитаемости кода
  const owner = req.user._id;

  // Получили ID статьи из строки запроса
  const { articleId } = req.params;

  // Использовали статический метод удаления статьи
  Article.findById(articleId).then((article) => {
    // Если статья не найдена, вернём 404 ошибку
    if (!article) {
      return Promise.reject(new NotFoundError('Статья не найдена'));
    }

    Article.checkOwner(owner, articleId).then((isOwner) => {
      // Если прав нет, никакого удаления
      if (!isOwner) {
        return Promise.reject(new UnauthorisedError('У вас нет прав на удаление этой статьи'));
      }

      // Если права есть, вернём промис на удаление статьи
      return Article.findByIdAndDelete(articleId)
        .then((deletedArticle) => {
          res.send(deletedArticle);
        });
    }).catch(next);
  });
};

module.exports = {
  getAllMyArticles,
  createArticle,
  deleteArticle,
};
