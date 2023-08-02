// Импорты
const router = require('express').Router();// создае роутер
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');// импортируем котнролеры
// Валидация
const {
  validateCreateCard, validateCardId,
} = require('../middlewares/validation');
// Настраиваем роутер карточек, адрес: /cards
// для /
router.get('/', getCards);// при гет-запросе всех карточек
router.post('/', validateCreateCard, createCard);// при пост-запросе для создания карточки
// для /cardId
router.delete('/:cardId', validateCardId, deleteCard);// при делит-запросе для удаления карточки
// для /cardId/likes
router.put('/:cardId/likes', validateCardId, likeCard);// при пут-запросе для лайка карточки
router.delete('/:cardId/likes', validateCardId, dislikeCard);// при делит-запросе для дизлайка
// Экспортируем роутер
module.exports = router;
