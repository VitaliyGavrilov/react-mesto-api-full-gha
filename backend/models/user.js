const mongoose = require('mongoose');// подключаем монго
const validator = require('validator');// подключаем валидатор
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized-err');
// создаем схему пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2, // мин.длин
    maxlength: 30, // макс.длин
    required: false, // свойство не обязательное
    default: 'Жак-Ив Кусто', // значение по умолчанию
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректная ссылка на аватар пользователя',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true, // значение должно быть уникальным
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректная электронная почта',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // необходимо добавить поле select, чтобы API не возвращал хеш пароля
  },
});
// добавляем метод для схемы, он проверяет почту и пароль при входе в аккаунт
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  // ищем пользователя по почте
  return this.findOne({ email }).select('+password')
    // если пользователя с такой почтой нет
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      // если есть - сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          // получаем пользователя
          return user;
        });
    });
};
// создаем на основек схемы модель и экспортируем ее
module.exports = mongoose.model('user', userSchema);
