import logo from "../img/MIREA_Gerb_Colour.png";
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { useCookies } from "react-cookie";

const Login = () => {
  
  const rename = false
  const [login, setLogin] = useState(null)
  const [password, setPassword] = useState(null)
  const [error, setError] = useState (null)
  const [cookie, setCookie, removeCookie] = useCookies(['user'])
  let navigate = useNavigate()

  const handleSubmit = async (e) => {
      e.preventDefault()
      try{
          console.log('posting', login, password)
          const response = await axios.post('./login', {login, password})

          setCookie('UserId', response.data.id)
          setCookie('login', response.data.login)
          setCookie('password', response.data.password)
          setCookie('AuthToken', response.data.token)

          const success = response.status === 201

          if(success) navigate('./Home')
      }
      catch (error) {
          console.log(error)
      }
  }

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
