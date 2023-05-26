// административные запросы
import BaseApi from './BaseApi.js';
class Auth extends BaseApi {
	constructor() {
		super();
		this._headers = { 'Content-Type': 'application/json' };
	}

	//метод регистрации пользователя (если регистрация - это одновременно и login, то надо разрешить принимать куки)
	registrate(_email, _password) {
		return this._request('signup', {
			method: 'POST',
			headers: this._headers,
			body: JSON.stringify({
				email: _email,
				password: _password
			})
		})
	};

	//метод авторизации пользователя
	logIn(_email, _password) {
		return this._request('signin', {
			method: 'POST',
			credentials: 'include', // разрешить браузеру отсылать и принимать куки
			headers: this._headers,
			body: JSON.stringify({
				email: _email,
				password: _password
			})
		})
	};

	//метод разлогинивания пользователя
	logOut(){
		return this._request('signout', {
			method: 'DELETE',
			credentials: 'include',
			headers: this._headers,
	})
};

};

//инициализация класса авторизации
const auth = new Auth();

export default auth;