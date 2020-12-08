const WrongDataError = require('../errors/wrongData'); // Ошибка "Неправильные данные"
const UnauthorisedError = require('../errors/unauthorised'); // Ошибка "Авторизуйтесь"
const NotFoundError = require('../errors/notFound'); // Ошибка "404"
const Article = require('../models/article');

// Возвращает массив сохранённых пользователем статей
const getAllMyArticles = (req, res, next) => {
  // Объявили владельца статьи для удобочитаемости кода
  const owner = req.user;

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
  const owner = req.user;

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
  // Получили ID статьи из строки запроса
  const { articleId } = req.params;

  Article.findById(articleId).then((article) => {
    // Если статья найдена
    if (article) {
      // Нам нужно сравнить идентификаторы владельца и текущего пользователя
      // При точном сравнении id не сравниваются корректно без приведения к строке
      // FIXME: реализовать метод проверки прав пользователя на статью
      if (article.owner.toString() === req.user.toString()) {
        console.log('User is owner');
        // Если текущий пользователь является владельцем, можно удалить карточку
        return Article.findByIdAndDelete(articleId).then((deletedArticleData) => {
          res.send(deletedArticleData);
        });
      }

      // Если юзер не авторизован, мы вернём ошибку
      return Promise.reject(new UnauthorisedError('У вас нет прав на удаление этой карточки'));
    }
    // Если статья не найдена, mongo вернёт Null, и мы вернём ошибку 404
    return Promise.reject(new NotFoundError('Статья не найдена'));
  }).catch(next);
};

module.exports = {
  getAllMyArticles,
  createArticle,
  deleteArticle,
};
