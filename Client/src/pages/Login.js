import logo from "../img/MIREA_Gerb_Colour.png";
import { useState } from 'react'

const Login = () => {
  
  const rename = false
  const [login, setLogin] = useState(null)
  const [password, setPassword] = useState(null)
  const [error, setError] = useState (null)

  const handleSubmit = (e) => {
      e.preventDefault()
      try{
          window.location.assign('/')
          console.log('Сделать запрос в БД')
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
