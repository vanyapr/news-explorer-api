const usersRouter = require('express').Router(); // Роутер
const { getUserInfo } = require('../controllers/users'); // Контроллер статей

usersRouter.get('/users/me', getUserInfo);

module.exports = usersRouter;
