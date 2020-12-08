const { celebrate, Joi } = require('celebrate'); // Модуль валидации передаваемых данных
const articlesRouter = require('express').Router(); // Роутер
const { getAllMyArticles, createArticle, deleteArticle } = require('../controllers/articles'); // Контроллер статей

articlesRouter.get('/articles', getAllMyArticles); // Список всех статей юзера
articlesRouter.post('/articles', createArticle); // Создать статью
articlesRouter.delete('/articles/:articleId', deleteArticle); // Удалить статью по идентификатору

module.exports = articlesRouter;
