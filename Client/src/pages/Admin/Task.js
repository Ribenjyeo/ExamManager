import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { Link } from 'react-router-dom'
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

const Task = () => {
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    const [fromData, setFromData] = useState({
        title : '',
        description : '',
        taskStatus: null,
        authorId: '',
        url: '',
    })

    const [title, setTitle] = useState()
    const [description, SetDescription] = useState()
    const [taskStatus, setTaskStatus] = useState(null)
    const [authorId, setAuthorId] = useState()
    const [url, setUrl] = useState()

    const instance = axios.create({  //экземпляр запроса с использованием текущего токена
        baseURL: "/task",
        timeout: 1000,
        headers: {'Authorization': 'Bearer '+ cookies.AuthToken}
      });
      

    const getTaskEdit = async () => { // получить данные задания по его ID
        try {

            const response = await instance.get(`/${cookies.editTask}`)

            setFromData({
                title : response.data.title,
                description :  response.data.description,
                taskStatus:  response.data.taskStatus,
                authorId:  response.data.authorId,
                url:  response.data.url
            })
        }
        catch(error) {
          console.log(error)
        }
      }

      const handleClick = async (e) => { //запрос на изменения задания
        e.preventDefault()
        console.log(fromData)
        const status = parseInt(taskStatus)
        const response = await instance.post('/modify', {
            taskId : cookies.editTask,
            title : title,
            description : description,
            studentId : cookies.editUser,
            taskStatus : status,
            authorId : authorId,
            url : url
            })
        navigate("/admin/users")
      }

      useEffect(() => {
        getTaskEdit()
    }, [])

    return (
        <>
            <AdminBar/>
            <div className="user">
                <SideBarAdmin/>
                <div className="userContainer">
                <div className="userTitleContainer">
                    <h2 className="userTitle">Изменения задания</h2>
                </div>
                <div className="userShow">
                    <div className="userShowTop">
                        <div className="userShowTopTitle">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/149/149071.png?auto=compress&cs=tinysrgb&dpr=2&w=500"
                                alt=""
                                className="userShowImg"
                            />
                            <span className="userShowUserName">{fromData.title}</span>
                        </div>
                    </div> 
                    <div className="userDetails">
                        <div className="userShowButton">
                            <span className="userShowTitle"><b>Данные задания:</b></span> 
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>Название: </b>{fromData.title}</span>
                            </div>
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>Описание: </b>{fromData.description ? fromData.description : "Нет описания"}</span>
                            </div>
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>Статус: </b>{fromData.taskStatus}</span>
                            </div>
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>ID Автора: </b>{fromData.authorId}</span>
                            </div>
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>URL задания: </b>{fromData.url}</span>
                            </div>
                        </div>
                        <div className="userUpdate">
                            <span className="userUpdateTitle"><b>Изменить:</b></span>
                            <form  className="userUpdateForm">
                                <div className="userUpdateLeft">
                                    <div className="userUpdateItemTask">
                                        <label>Название задания: </label>
                                        <input
                                            type="text"
                                            name="title"
                                            onChange={e => setTitle(e.target.value)}
                                            placeholder={fromData.title}
                                            className="userUpdateInput"
                                        />
                                    </div>
                                    <div className="userUpdateItemTask">
                                        <label>Описание задания: </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            onChange={e => SetDescription(e.target.value)}
                                            placeholder={fromData.description ? fromData.description : "Нет описания"}
                                            className="userUpdateInput"
                                        />
                                    </div>
                                    <div className="userUpdateItemTask">
                                        <label>Статус выполнения: </label>
                                        <input
                                            name="groupId"
                                            onChange={e => setTaskStatus(e.target.value)}
                                            type="text"
                                            placeholder={fromData.taskStatus}
                                            className="userUpdateInput"
                                        />
                                    </div>
                                    <div className="userUpdateItemTask">
                                        <label>URL задания: </label>
                                        <input
                                            name="groupId"
                                            onChange={e => setURL(e.target.value)}
                                            type="text"
                                            placeholder={fromData.url}
                                            className="userUpdateInput"
                                        />
                                    </div>
                                </div>
                                <div className="editUser">
                                    <button className="buttonEditUser" onClick={(e) => {handleClick(e)}}>Внести изменения</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Task