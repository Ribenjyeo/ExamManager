import logo from "../img/MIREA_Gerb_Colour.png";
import { useCookies } from "react-cookie";
import React, {useState, useEffect} from "react";
import axios from 'axios'


const Nav = ({authToken}) => {
  const [cookies, setCookies, removeCookies] = useCookies(['user']);
  const [fromData, setFromData] = useState({
    id: cookies.id,
    firstName: '',
    lastName: '',	
    groupName: ''
  })

  console.log(authToken)

  const instance = axios.create({
    baseURL: "/user",
    timeout: 1000,
    headers: {'Authorization': 'Bearer '+ authToken}
  });

  console.log(cookies.UserId)

  const getUserName = async (e) => {
    try {
      
      const response = await instance.get(`/${cookies.UserId}`)
      setCookies("firstName", response.data.firstName)
      setCookies("lastName", response.data.lastName)
      
      console.log(response.data)

    }
    catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
      
      getUserName()
    }, [])

  
  const logout = () => {
    removeCookies("UserId", cookies.id);
    removeCookies("AuthToken", cookies.AuthToken);
    window.location.assign('/auth');
  };

  return (
    <nav>
      <span className="logo-container">
        <img
          className="logo"
          src={logo}
          alt="учебный портал по системному администрированию РТУ МИРЭА"
        />
      </span>
      <span>Учебный портал РТУ МИРЭА</span>
      <div className="nav-items">
        <ul>
          <li>
            <a href="#">Главная</a>
          </li>
          <li>
            <a href="#">Настройки</a>
          </li>
          (
            <li>
              <a href="#">Смена данных</a>
            </li>
          )
        </ul>
      </div>
      <div className="account">
        <span>{cookies.firstName}</span>
        <span>{cookies.lastName}</span>
        <button className="nav-button" onClick={logout}>
          {authToken ? "Войти" : "Выйти"}
        </button>
      </div>
    </nav>
  );
};

export default Nav;
