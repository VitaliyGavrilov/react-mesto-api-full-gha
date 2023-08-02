// Импорты
const Card = require('../models/card');// импортируем модель карточек
// импортируем ошибки и статусы ответов
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-error');
const {
  CREATED, OK,
} = require('../const/responses');
// Создаем контролеры для карточек и экспортируем их
// GET /cards — возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch(next);// переходим в централизованный обработчик ошибок
};
// POST /cards — создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка создания карточки, переданы некорректные данные'));
      } else {
        next(err);// переходим в централизованный обработчик ошибок
      }
    });
};
// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) { // проверяем наличие
        throw new NotFoundError('Нет карточки с таким id');
      } else if (card.owner.toString() !== req.user._id) { // проверяем авторство
        throw new ForbiddenError('Вы не являетесь автором карточки, удаление невозможно');
      } else { // если карточка есть и пользовтель-автор, то удаляем
        Card.findByIdAndRemove(cardId)
          .then((usersCard) => res.status(OK).send({ data: usersCard }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка удаления карточки, передан некорректный id'));
      } else {
        next(err);
      }
    });
};
// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      } else {
        res.status(OK).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка лайка, передан некорректный id'));
      } else {
        next(err);
      }
    });
};
// DELETE /cards/:cardId/likes — убрать лайк с карточк
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      } else {
        res.status(OK).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка дизлайка, передан некорректный id'));
      } else {
        next(err);
      }
    });
};
