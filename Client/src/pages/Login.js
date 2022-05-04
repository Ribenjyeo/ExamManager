import logo from "../img/MIREA_Gerb_Colour.png";
import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { Cookies, useCookies } from "react-cookie";
import axios from "axios";

const Login = () => {
  
  const rename = false
  const [login, setLogin] = useState(null)
  const [password, setPassword] = useState(null)
  const [error, setError] = useState (null)
  const [cookies, setCookies, removeCookies] = useCookies(['user'])
  let navigate = useNavigate()

  const handleSubmit = async (e) => {
      e.preventDefault()
      try{
          const response = await axios.post('/login', {login, password})
  
          setCookies('UserId', response.data.id)
          setCookies('AuthToken', response.data.token)

          // console.log("cookies:", response.data)
          // console.log("cookies - token:", cookies.AuthToken)

          const success = response.status === 200

          if(success) navigate('/')
      }
      catch (error) {
        console.log(error)
      //   axios.interceptors.response.use( //наработка обработчика ошибок
      //     (response) => {
      //       return response;
      //     },
      //     (error) => {
      //       if (typeof error.response === "undefined") {
      //         console.log("network error");
      //         window.location.href = "/error-page";
      //       }
      //       if (error.response.status === 401) {
      //         // Authorization error
      //         window.location.href = "/signin";
      //       } else if (error.response.status === 500) {
      //         // Server error
      //         window.location.href = "/500-error";
      //       } else {
      //         return Promise.reject(error);
      //       }
      //     }
      // );
      }
  }

  useEffect(() => { //автоматических переход на главную страницу если пользователь авторизирован
    if(cookies.AuthToken !== undefined) {
      navigate("/")
    }
  }, [])

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
          <p>{rename ? 'Введите новые данные пользователя' : 'Для продолжение необходима авторизация'}</p>
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
                    onChange={e => setLogin(e.target.value)}
                
                />
              <label>Пароль :</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="**********"
                    required={true}
                    onChange={e => setPassword(e.target.value)}
                />
                <input 
                    type="submit"
                    value="Войти"
                />
          </form>
          </div>
        </div>
      </div>
  
    </div>
  );
};

export default Login;
