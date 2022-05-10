import logo from "../img/MIREA_Gerb_Colour.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies, useCookies } from "react-cookie";
import axios from "axios";

const Login = () => {
  const rename = false;
  const [login, setLogin] = useState(null);
  const [password, setPassword] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [error, setError] = useState(false);
  const [cookies, setCookies, removeCookies] = useCookies(["user"]);
  
  let navigate = useNavigate();

  const instance = axios.create({  //экземпляр запроса с использованием текущего токена
    baseURL: "/user",
    timeout: 1000,
    headers: {'Authorization': 'Bearer '+ cookies.AuthToken}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post('/modify', {
        id : cookies.UserId,
        login : login,
        password : password,
        firstName : firstName,
        lastName : lastName
    })

    navigate('/')
    window.location.reload()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-modal">
      <div className="header">
        <div className="logo-container">
          <img className="img-logo" src={logo} alt="Логотип МИРЭА" />
        </div>
        <div className="title">
          МИРЭА - Российский технологический университе
          <br />
          <span className="subtitle">Аутентификация пользователей</span>
        </div>
      </div>
      <div className="auth">
        <div className="band">
          <p>Введите новые данные пользователя</p>
        </div>
        <div className="modal">
          <div className="modal-box">
            <form onSubmit={handleSubmit}>
              <label>Логин :</label>
              <input
                type="text"
                id="login"
                name="login"
                placeholder="Ничаев Илья"
                required={true}
                onChange={(e) => setLogin(e.target.value)}
              />
              <label>Пароль :</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="**********"
                required={true}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Имя :</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Илья"
                required={true}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label>Фамилия :</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Ничаев"
                required={true}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input type="submit" value="Сменить данные" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
