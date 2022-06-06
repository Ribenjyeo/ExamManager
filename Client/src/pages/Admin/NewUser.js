import * as React from "react";
import AdminBar from "../../components/AdminBar";
import SideBarAdmin from "../../components/SideBarAdmin";
import { useState, useEffect} from 'react'
import { useCookies } from "react-cookie";
import {useNavigate} from 'react-router-dom'
import Alert from '@mui/material/Alert';
import ErrorIcon from '@mui/icons-material/Error';

const NewUser = () => {
  let navigate = useNavigate()
  const [error, setErorr] = useState(false)
  const [errorText, setErrorText] = useState()
  const [cookies, setCookies, removeCookies] = useCookies(['user'])
  const [login, setLogin] = useState(null)
  const [password, setPassword] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [role, setRole] = useState(null)
  const [group, setGroup] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const [groupList, setGroupList] = useState([])

  const groups = async () => { //запрос на получение групп
    const response = await fetch('/groups', {method: 'POST', headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
    const json = await response.json()
    const stringi = JSON.stringify(json)
    const parse = JSON.parse(stringi)
    setGroupList(parse.groups)
  }
  
  const handleClick = async (e) => { //запрос на добавление пользователя
    e.preventDefault()
    try {
      if(role == 1) {
        if(login.trim().length === 0 ||
        password.trim().length === 0 ||
        firstName.trim().length === 0 ||
        lastName.trim().length === 0 ||
        role === null ) {
          setErorr(true)
          setErrorText("Заполните все поля")
        }
        else if(group !== null){
          let currentGroupId = null
          let check = false
          for (let i = 0; i < groupList.length; i++){  //Поиск совпадений в изменяемой группе
              if(groupList[i].name === group) {
                  check = true
                  currentGroupId = groupList[i].id
              }
          }
          if (!check) {
            setErorr(true)
            setErrorText("Группа не найдена")
          }
          else {
            let users = {
              'users' : [{
                login: login,
                password: password,
                firstName: firstName,
                lastName: lastName,
                role: parseInt(role),
                groupId: currentGroupId
                }]
              }
            const response = await fetch('/users/create', {
            method: "POST",
            headers: {
              'Content-Type' : 'application/json',
              'Authorization' : 'Bearer ' + cookies.AuthToken},
              body: JSON.stringify(users)
            })
          }
        
        
      }
      }
      if(role == 2) {
        if(login.trim().length === 0 ||
        password.trim().length === 0 ||
        role === null ) {
          setErorr(true)
          setErrorText("Заполните логин или пароль")
        }
        else {
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
  
          // navigate('/admin/users')
        }
      }
    }
    catch(error){
      console.log(error)
    }
  }

  function onClose () {
    setErorr(false)
  }

  function isDisabledChange () {
    if (role == 1) {
      setIsDisabled(false)
    }
    if (role == 2) {
      setIsDisabled(true)
      setFirstName(null)
      setLastName(null)
      setGroup(null)
    }
  }

  useEffect(() => {
    groups()
  }, [])

  useEffect(() => {
    isDisabledChange()
  })

  return (
    <>
      {error && (<Alert
        severity="error"
        iconMapping={{success: <ErrorIcon fontSize="medium"/>}}
        onClose={(e) => {onClose()}}>
          <strong>Ошибка!</strong> {errorText}</Alert>)}
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
                <label>Пароль</label>
                <input type="password" placeholder="Пароль" onChange={e => setPassword(e.target.value.trim())}/>
              </div>
              <div className="newUserItem">
                <label>Имя</label>
                <input type="text" placeholder="Имя" value={firstName == null ? '' : firstName} disabled={isDisabled} onChange={e => setFirstName(e.target.value.trim())}/>
              </div>
              <div className="newUserItem">
                <label>Фамилия</label>
                <input type="text" placeholder="Фамилия" value={lastName == null ? '' : lastName} disabled={isDisabled} onChange={e => setLastName(e.target.value.trim())}/>
              </div>
              <div className="newUserItem">
                <label>Группа</label>
                <input type="password" placeholder="Название группы" value={group == null ? '' : group} disabled={isDisabled} onChange={e => setGroup(e.target.value.trim())}/>
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
