const jwt = require('jsonwebtoken');
const UnauthorisedError = require('../errors/unauthorised');
const { JWT_SECRET = 'development_only_secret_key' } = process.env;

const authorise = (req, res, next) => {
  const { authorization } = req.headers; // Получили JWT токен из хидера

  // Прооверяем, передан ли токен, и корректен ли он
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // В целях дебагинга и наглядности мы распишем ошибки
    next(new UnauthorisedError('Необходима авторизация: не передан токен'));
    return;
  }

  // Если токен передан, достаём из него сам JWT
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // Метод jwt.verify() вернёт пэйлоад токена
    payload = jwt.verify(token, JWT_SECRET); // Вторым аргументом передали секретный ключ
  } catch (error) {
    // Если что-то пошло не так, вернётся ошибка, которую надо обработать в блоке catch
    // В целях дебагинга и наглядности мы распишем текст ошибки
    next(new UnauthorisedError('Необходима авторизация: токен недействителен или просрочен'));
    return;
  }

  // Записали _id пользователя в запрос
  req.user = payload;
  next();
};

module.exports = authorise;
