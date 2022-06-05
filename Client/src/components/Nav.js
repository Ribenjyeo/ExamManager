import logo from "../img/MIREA_Gerb_Colour.png";
import { useCookies } from "react-cookie";
import React, {useState, useEffect} from "react";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


const Nav = () => {
  const [cookies, setCookies, removeCookies] = useCookies(['user']);
  let navigate = useNavigate()
  const [fromData, setFromData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    role: '',	
    groupName: ''
  })

  const instance = axios.create({  //экземпляр запроса с использованием текущего токена
    baseURL: "/user",
    timeout: 1000,
    headers: {'Content-Type' : 'application/json','Authorization': 'Bearer '+ cookies.AuthToken}
  });

  const getUserName = async () => { // получить данные пользователя по его ID
    try {
      const response = await instance.get(`/${cookies.UserId}`)
      if(response.data.status === 401) { //если токен не подходит то редиркер на страницу авторизации
        console.log("logout")
      }
      setCookies("firstName", response.data.firstName)
      setCookies("lastName", response.data.lastName)
      setCookies("userRole", response.data.role)
    
      setFromData({
          id : response.data.id,
          firstName : response.data.firstName,
          lastName : response.data.lastName,
          role : response.data.role,
          groupName: response.data.groupNam
        })
    }
    catch(error) {
      console.log(error)
      // logout()
    }
  }

  useEffect(() => {
      getUserName()
    }, [])

  const logout = () => { //выход из аккаунта
    removeCookies("UserId", cookies.id);
    removeCookies("AuthToken", cookies.AuthToken);
    removeCookies("firstName", cookies.firstName)
    removeCookies("lastName", cookies.lastName)
    removeCookies("userRole", cookies.userRole)
    navigate('/auth')

    window.location.reload()
  };

  return (
    <nav>
      <span className="logo-container">
        <a href="/">
        <img
          className="logo"
          src={logo}
          alt="учебный портал по системному администрированию РТУ МИРЭА"
        />
        </a>
      </span>
      <a href="/"><span>Учебный портал РТУ МИРЭА</span></a>
      <div className="nav-items">
        <ul>
          <li>
            <a href="/">Главная</a>
          </li>
          {fromData.role === 2 && <li>
            <a href="/admin">Админ панель</a>
          </li>}
          {fromData.role === 1 && <li>
            <a href="/rename">Смена данных</a>
          </li>}
        </ul>
      </div>
      <div className="account">
        <span>{fromData.firstName + " " + fromData.lastName}</span> 
        <button className="nav-button" onClick={logout}>
          Выйти
        </button>
      </div>
    </nav>
  );
};

export default Nav;
