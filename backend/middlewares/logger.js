// импортируем нужные модули
const winston = require('winston');// библиотекой для логирования winston
const expressWinston = require('express-winston');// мидлвэр express-winston, длч работы с библиотекой в express
// логируем запросы к серверу и ошибки, которые на нём происходят
// создадим логгер запросов
const requestLogger = expressWinston.logger({
  transports: [ // отвечает за то, куда нужно писать лог
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(), // отвечает за формат записи логов
});
// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});
// экспорт
module.exports = {
  requestLogger,
  errorLogger,
};
