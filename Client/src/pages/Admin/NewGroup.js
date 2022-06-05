import * as React from "react";
import AdminBar from "../../components/AdminBar";
import SideBarAdmin from "../../components/SideBarAdmin";
import { useState} from 'react'
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";


const NewGroup = () => {
    const [name, setName] = useState(null)
    const [error, setError] = useState(false);
    let navigate = useNavigate()
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    const handleClick = async (e) => { //запрос на добавление пользователя
        e.preventDefault()
        try {
          if(name.trim().length === 0) {
            setError(true)
          }
          else {
            let group = {
                name : name
            }
            console.log(group)
            const response = await fetch('/group/create', {
            method: "POST",
            headers: {
              'Content-Type' : 'application/json',
              'Authorization' : 'Bearer ' + cookies.AuthToken},
              body: JSON.stringify(group)
            })
            navigate('/admin/groups')
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
                <strong>Ошибка!</strong> Вы не ввели название группы
              </p>
            </div>
          )}
         <AdminBar/>
            <div className="AdminContainer">
                <SideBarAdmin/>
                <div className="others">
                <div className="newGroup">
                    <h2 className="newGroupTitle">Создание группы</h2>
                    <form className="newGroupForm">
                        <div className="newGroupItem">
                            <label>Название группы</label>
                            <input type="text" placeholder="Название группы" onChange={e => setName(e.target.value.trim())} required/>
                        </div>
                        <div className="buttonGroupForm">
                            <button className="newGroupButton" onClick={(e) => {handleClick(e)}}>Создать</button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </>
    )
}

export default NewGroup