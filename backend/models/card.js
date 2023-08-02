const mongoose = require('mongoose');// подключаем монго
const validator = require('validator');// подключаем валидатор
// создаем схему для карточки
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (correct) => validator.isURL(correct),
      message: 'Некорректная ссылка на изображение карточки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: mongoose.Schema.Types.Array,
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// создаем на основек схемы модель и экспортируем ее
module.exports = mongoose.model('card', cardSchema);
