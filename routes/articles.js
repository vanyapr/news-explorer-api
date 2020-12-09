const { celebrate, Joi } = require('celebrate'); // Модуль валидации передаваемых данных
const articlesRouter = require('express').Router(); // Роутер
const { getAllMyArticles, createArticle, deleteArticle } = require('../controllers/articles'); // Контроллер статей

articlesRouter.get('/articles', getAllMyArticles); // Список всех статей юзера
// Создать статью
articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required(),
    image: Joi.string().required(),
  }),
}), createArticle);

// Удалить статью по идентификатору
articlesRouter.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().length(24),
  }),
}), deleteArticle);

module.exports = articlesRouter;
