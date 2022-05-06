import * as React from "react";
import AdminBar from "../../components/AdminBar";
import SideBarAdmin from "../../components/SideBarAdmin";
import { useState} from 'react'
import { useCookies } from "react-cookie";
import axios from 'axios'

const NewTask = () => {
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
                            <label>Название группы</label>
                            <input type="text" placeholder="Название группы" onChange={e => setName(e.target.value)} required/>
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