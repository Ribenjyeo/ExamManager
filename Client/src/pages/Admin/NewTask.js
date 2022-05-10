import * as React from "react";
import AdminBar from "../../components/AdminBar";
import SideBarAdmin from "../../components/SideBarAdmin";
import { useState, useEffect} from 'react'
import { useCookies } from "react-cookie";
import {useNavigate} from 'react-router-dom'

const NewTask = () => {
    let navigate = useNavigate()
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [url, setUrl] = useState(null)

    const handleClick = async (e) => { //запрос на добавление задания пользователю
        e.preventDefault()
        try {
          if(title == null ||
            url == null) {
              console.log("Вы ввели не все данные")
            }
            else {
              let task = {
                  title : title,
                  description : description,
                  url : url,
                  studentId : cookies.editUser
              }

              const response = await fetch('/task/create', {
              method: "POST",
              headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + cookies.AuthToken},
                body: JSON.stringify(task)
              })
            }
            navigate('/admin/users')
          }
        catch(error){
          console.log(error)
        }
      }

    return (
        <>
         <AdminBar/>
            <div className="AdminContainer">
                <SideBarAdmin/>
                <div className="others">
                <div className="newTask">
                    <h2 className="newTaskTitle">Создание задания</h2>
                    <form className="newTaskForm">
                        <div className="newTaskItem">
                            <label>Название задания</label>
                            <input type="text" placeholder="Название задания" onChange={e => setTitle(e.target.value)} required/>
                        </div>
                        <div className="newTaskItem">
                            <label>Описание задания</label>
                            <input type="text" placeholder="Описание задания" onChange={e => setDescription(e.target.value)} required/>
                        </div>
                        <div className="newTaskItem">
                            <label>URL</label>
                            <input type="text" placeholder="URL для перехода к ресурсу задания" onChange={e => setUrl(e.target.value)} required/>
                        </div>
                        <div className="buttonTaskForm">
                            <button className="newTaskButton" onClick={(e) => {handleClick(e)}}>Создать</button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </>
    )
}

export default NewTask