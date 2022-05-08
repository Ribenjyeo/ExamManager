import * as React from "react";
import AdminBar from "../../components/AdminBar";
import SideBarAdmin from "../../components/SideBarAdmin";
import { useState} from 'react'
import { useCookies } from "react-cookie";

const NewUser = () => {
  const [error, setErorr] = useState(false)
  const [cookies, setCookies, removeCookies] = useCookies(['user'])
  const [login, setLogin] = useState(null)
  const [password, setPassword] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [role, setRole] = useState(null)

  console.log(error)
  
  const handleClick = async (e) => { //запрос на добавление пользователя
    e.preventDefault()
    try {
      if(login == null ||
        password == null ||
        firstName == null ||
        lastName == null ||
        role == null ) {
          console.log("Один из элементов NuLL!", login, password, firstName, lastName, role)
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
            console.log(users)
          const response = await fetch('/users/create', {
          method: "POST",
          headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + cookies.AuthToken},
            body: JSON.stringify(users)
          })

          window.location.reload()
        }
      }
    catch(error){
      console.log(error)
    }
  }

  return (
    <>
      <div className={error ? "error-message-user" : "hidden"}>
        <p>
          <strong>Ошибка!</strong> Вы пытались отправить пустые данные
        </p>
      </div>
      <AdminBar />
      <div className="createUser">
        <SideBarAdmin />
        <div className="others">
          <div className="newUser">
            <h2 className="newUserTitle">Создание пользователя</h2>
            <form className="newUserForm">
              <div className="newUserItem">
                <label>Логин</label>
                <input type="text" placeholder="Логин" onChange={e => setLogin(e.target.value)}/>
              </div>
              <div className="newUserItem">
                <label>Имя</label>
                <input type="text" placeholder="Имя" onChange={e => setFirstName(e.target.value)}/>
              </div>
              <div className="newUserItem">
                <label>Фамилия</label>
                <input type="text" placeholder="Фамилия" onChange={e => setLastName(e.target.value)}/>
              </div>
              <div className="newUserItem">
                <label>Пароль</label>
                <input type="password" placeholder="Пароль"  onChange={e => setPassword(e.target.value)}/>
              </div>
              <div className="newUserItem">
                <label>Роль пользователя</label>
                <select className="newUserSelect" name="active" onChange={e => setRole(e.target.value || null)}>
                  <option value="">Выберите роль</option>
                  <option value="1">Студент</option>
                  <option value="0">Администратор</option>
                </select>
              </div>
              <div className="buttonForm">
              <button className="newUserButton" onClick={(e) => {handleClick(e)}}>Create</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewUser;
