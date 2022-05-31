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
    const [idMachine, setIdMachine] = useState(null)
    const [titleMachine, setTitleMachine] = useState(null)
    const [order, setOrder] = useState(null)

    const handleClick = async (e) => { //запрос на добавление задания в систему
        e.preventDefault()
        try {
          if(title == null ||
            description == null ||
            idMachine == null) {
              console.log("Вы ввели не все данные")
            }
            else {
              let task = {
                  title : title,
                  description : description,
                  virtualMachines : [{
                    id : idMachine,
                    title : titleMachine,
                    order: parseInt(order)
                  }]
              }

              const response = await fetch('/task/create', {
              method: "POST",
              headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + cookies.AuthToken},
                body: JSON.stringify(task)
              })
            }
            navigate('/admin/tasks')
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
                    <h2 className="newTaskTitle">Создание задания:</h2>
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
                            <label>Идентификатор виртуальной машины</label>
                            <input type="text" placeholder="Идентификатор виртуальной машины" onChange={e => setIdMachine(e.target.value)} required/>
                        </div>
                        <div className="newTaskItem">
                            <label>Название виртуальной машины</label>
                            <input type="text" placeholder="Название виртуальной машины" onChange={e => setTitleMachine(e.target.value)} required/>
                        </div>
                        <div className="newTaskItem">
                            <label>Порядковый номер виртуальной машины</label>
                            <input type="text" placeholder="Порядковый номер виртуальной машины" onChange={e => setOrder(e.target.value)} required/>
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