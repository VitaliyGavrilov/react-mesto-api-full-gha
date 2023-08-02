// Импорты
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');// импортируем модель пользователей
// импортируем ошибки и статусы ответов
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const {
  CREATED, OK,
} = require('../const/responses');
// Создаем контролеры для взаимодейтвия с данными пользователей и сразу экспортируем их
// GET /users — возвращает всех пользователей
module.exports.getUsers = (req, res, next) => { // для гет-запроса всех пользователей
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);// переходим в централизованный обработчик ошибок
};
// GET /users/:userId - возвращает пользователя по _id
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) { // если такого пользователя нет, сгенерируем исключение
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка поиска пользователя, передан некорректный id'));
      } else {
        next(err);
      }
    });
};
// GET /users/me - возвращает информацию о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((selectedUser) => res.status(OK).send(selectedUser))
    .catch(next);// переходим в централизованный обработчик ошибок
};
// PATCH /users/me — обновляет профиль
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка обновления данных профиля, переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
// PATCH /users/me/avatar — обновляет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка обновления автара, переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
// Создаем контролеры для создания пользователя и входа в аккаунт
// POST /signin — вход в аккаунт
module.exports.login = (req, res, next) => {
  // деструктуризацие получаем данные из тела запроса
  const { email, password } = req.body;
  // проверяем данные методом модели
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const userToken = jwt.sign({ _id: user._id }, '123456789', { expiresIn: '7d' });
      res.send({ userToken });
    })
    .catch(next);
};
// POST /signup — регистрация, создаёт пользователя
module.exports.createUser = (req, res, next) => { // создаем контролер для пост-запроса
  // деструктуризацие получаем данные из тела запроса
  const {
    name, about, avatar, email, password,
  } = req.body;
  // хеширование пароля
  bcrypt.hash(password, 10)
    // создаем пользователя
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    // отправляем ответ= данные созданного пользователя, без пароля
    .then((user) => res.status(CREATED).send({
      _id: user._id, name, about, avatar, email,
    }))
    // обрабатываем ошибки
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка регистрации, переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Ошибка регистрации, пользователь с указанной почтой уже существует'));
      } else {
        next(err);
      }
    });
};
