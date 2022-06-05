import * as React from "react";
import AdminBar from "../../components/AdminBar";
import SideBarAdmin from "../../components/SideBarAdmin";
import { useState} from 'react'
import { useCookies } from "react-cookie";
import {useNavigate} from 'react-router-dom'

const NewUser = () => {
  let navigate = useNavigate()
  const [error, setErorr] = useState(false)
  const [cookies, setCookies, removeCookies] = useCookies(['user'])
  const [login, setLogin] = useState(null)
  const [password, setPassword] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [role, setRole] = useState(null)

  // console.log(error)

  // console.log(role)
  
  const handleClick = async (e) => { //запрос на добавление пользователя
    e.preventDefault()
    try {
      if(login.trim().length === 0 ||
        password.trim().length === 0 ||
        firstName.trim().length === 0 ||
        lastName.trim().length === 0 ||
        role === null ) {
          setErorr(true)
        }
        else {
          setErorr(false)
          let users = {
            'users' : [{
              login: login,
              password: password,
              firstName: firstName,
              lastName: lastName,
              role: parseInt(role)
              }]
            }
          const response = await fetch('/users/create', {
          method: "POST",
          headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + cookies.AuthToken},
            body: JSON.stringify(users)
          })

          navigate('/admin/users')
        }
      }
    catch(error){
      console.log(error)
    }
  }

  return (
    <>
      {error && (
        <div className="error-message">
          <p>
            <strong>Ошибка!</strong> Заполните все поля
          </p>
        </div>
      )}
      <AdminBar />
      <div className="createUser">
        <SideBarAdmin />
        <div className="others">
          <div className="newUser">
            <h2 className="newUserTitle">Создание пользователя</h2>
            <form className="newUserForm">
              <div className="newUserItem">
                <label>Логин</label>
                <input type="text" placeholder="Логин" onChange={e => setLogin(e.target.value.trim())}/>
              </div>
              <div className="newUserItem">
                <label>Имя</label>
                <input type="text" placeholder="Имя" onChange={e => setFirstName(e.target.value.trim())}/>
              </div>
              <div className="newUserItem">
                <label>Фамилия</label>
                <input type="text" placeholder="Фамилия" onChange={e => setLastName(e.target.value.trim())}/>
              </div>
              <div className="newUserItem">
                <label>Пароль</label>
                <input type="password" placeholder="Пароль"  onChange={e => setPassword(e.target.value.trim())}/>
              </div>
              <div className="newUserItem">
                <label>Роль пользователя</label>
                <select className="newUserSelect" name="active" onChange={e => setRole(e.target.value.trim() || null)}>
                  <option value="">Выберите роль</option>
                  <option value="1">Студент</option>
                  <option value="2">Администратор</option>
                </select>
              </div>
              <div className="buttonForm">
              <button className="newUserButton" onClick={(e) => {handleClick(e)}}>Создать</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewUser;
