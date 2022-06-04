import * as React from "react";
import AdminBar from "../../components/AdminBar";
import SideBarAdmin from "../../components/SideBarAdmin";
import { useState, useEffect} from 'react'
import { useCookies } from "react-cookie";
import {useNavigate} from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const NewTask = () => {
    let navigate = useNavigate()
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [idMachine, setIdMachine] = useState(null)
    const [titleMachine, setTitleMachine] = useState(null)
    const [order, setOrder] = useState(null)
    const [error, setError] = useState(false)
    const [addData, setVal] = useState("")
   
    const handleChangeData = (e, editor) => {
      const data = editor.getData()
      setDescription(data)
    }

    const handleClick = async (e) => { //запрос на добавление задания в систему
        e.preventDefault()
        try {
          if(title.trim().length === 0 ||
            description.trim().length === 0 ||
            idMachine.trim().length === 0) {
              setError(true)
            }
            else {
              setError(false)
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
        {error && (
        <div className="error-message">
          <p>
            <strong>Ошибка!</strong> Заполните все поля
          </p>
        </div>
      )}
         <AdminBar/>
            <div className="AdminContainer">
                <SideBarAdmin/>
                <div className="others">
                <div className="newTask">
                    <h2 className="newTaskTitle">Создание задания:</h2>
                    <form className="newTaskForm">
                        <div className="newTaskItem">
                            <label>Название задания</label>
                            <input type="text" placeholder="Название задания" onChange={e => setTitle(e.target.value.trim())} required/>
                        </div>
                        <div className="newTaskItem">
                            <label>Идентификатор виртуальной машины</label>
                            <input type="text" placeholder="Идентификатор виртуальной машины" onChange={e => setIdMachine(e.target.value.trim())} required/>
                        </div>
                        <div className="newTaskItem">
                            <label>Название виртуальной машины</label>
                            <input type="text" placeholder="Название виртуальной машины" onChange={e => setTitleMachine(e.target.value.trim())} required/>
                        </div>
                        <div className="newTaskItem">
                            <label>Номер виртуальной машины</label>
                            <input type="text" placeholder="Порядковый номер виртуальной машины" onChange={e => setOrder(e.target.value.trim())} required/>
                        </div>
                        <div className="CKeditor">
                            <label>Описание задания</label>
                            <div className="editor-data">
                              <CKEditor editor={ClassicEditor} data={addData} onChange={handleChangeData}/>
                            </div>

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