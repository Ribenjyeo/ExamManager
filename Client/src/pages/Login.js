import logo from "../img/MIREA_Gerb_Colour.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies, useCookies } from "react-cookie";
import axios from "axios";
import Alert from '@mui/material/Alert';
import ErrorIcon from '@mui/icons-material/Error';

const Login = () => {
  const rename = false;
  const [login, setLogin] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(false);
  const [cookies, setCookies, removeCookies] = useCookies(["user"]);
  
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { login, password });
      setError(false);
      setCookies("UserId", response.data.id);
      setCookies("AuthToken", response.data.token);

      // console.log("cookies:", response.data)
      // console.log("cookies - token:", cookies.AuthToken)
      const success = response.data.status === 200;
      const error = response.data.status === 400;

      if (success) {
        navigate("/")
        window.location.reload()
      }
      if (error) {
        setError(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function onClose () {
    setError(false)
  }

  return (
    <div className="auth-modal">
      {error && (<Alert
        severity="error"
        iconMapping={{success: <ErrorIcon fontSize="medium"/>}}
        onClose={(e) => {onClose()}}>
          <strong>Ошибка!</strong> Пользователя с такими логином или паролем не существует
        </Alert>)}
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
          <p>Для продолжение необходима авторизация</p>
        </div>
        <div className="modal">
          <div className="modal-box">
            <form onSubmit={handleSubmit}>
              <label>Логин :</label>
              <input
                type="text"
                id="login"
                name="login"
                placeholder="Логин"
                required={true}
                onChange={(e) => setLogin(e.target.value)}
              />
              <label>Пароль :</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="******"
                required={true}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input type="submit" value="Войти" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
