const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
// мидлвэр для авторизации, что бы каждый раз не логиниться
module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  // Избавляемся от Bearer и записываем токен
  const userToken = authorization.replace('Bearer ', '');
  let payload;
  // попытаемся верифицировать токен
  try {
    payload = jwt.verify(userToken, '123456789');
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  // записываем пейлоуд в объект запроса
  req.user = payload;
  // пропускаем запрос дальше
  return next();
};
