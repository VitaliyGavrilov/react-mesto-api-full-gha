class Api {
  constructor({ baseUrl }) {
    // тело конструктора, принимает:
    this._baseUrl = baseUrl;//ссылка на сервер
    // this._headers = headers;//уникальный токен
  }
  //--публичные методы:
  //-информация пльзователя:
  //для загрузки информации о пользователе с сервера
  getUserInfo() {
    const token = localStorage.getItem("token");
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        authorization: `Bearer ${ token }`,
        "Content-Type": "application/json",
      },
    }).then(this._checkResponse);
  }
  //для изменения информации о пользователе
  patchUserInfo( name, profession ) {
    const token = localStorage.getItem("token");
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${ token }`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        about: profession
      }),
    }).then(this._checkResponse);
  }
  //-карточки:
  //для загрузки карточек с сервера
  getInitialCards() {
    const token = localStorage.getItem("token");
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        authorization: `Bearer ${ token }`,
        "Content-Type": "application/json",
      },
    }).then(this._checkResponse);
  }
  //для загрузки карточек на сервер
  postCard(name, link) {
    const token = localStorage.getItem("token");
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${ token }`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, link }),
    }).then(this._checkResponse);
  }
  //удаление карточки
  deleteCard(id) {
    const token = localStorage.getItem("token");
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${ token }`,
        "Content-Type": "application/json",
      },
    }).then(this._checkResponse);
  }
  //-аватар:
  //изменение аватара
  patchUserAvatar( {avatar} ) {
    const token = localStorage.getItem("token");
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${ token }`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: avatar,
      }),
    }).then(this._checkResponse);
  }
  //-лайки
  changeLikeCardStatus(id, isLiked) {
    const token = localStorage.getItem("token");
    if (isLiked){
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${ token }`,
        "Content-Type": "application/json",
      },
    }).then(this._checkResponse);
    } else {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${ token }`,
        "Content-Type": "application/json",
      },
    }).then(this._checkResponse);
    }
  }
  //--приватные методы:
  //для проверки ответа с сервера
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
}

const api = new Api ({
  baseUrl: 'http://localhost:3000',
})

export default api;