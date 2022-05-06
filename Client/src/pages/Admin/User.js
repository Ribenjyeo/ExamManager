import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { Link } from 'react-router-dom'
import { useState, useEffect} from 'react'
import { useCookies } from "react-cookie";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const User = () => {
    let navigate = useNavigate()
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    const [fromData, setFromData] = useState({
        firstName : '',
        lastName : '',
        role: '',
        groupId: '',
        taskCounter: ''
    })

   const [firstName, setFirstName] = useState()
   const [lastName, setLastName] = useState()
   const [role, setRole] = useState()
   const [groupId, setGroupId] = useState()
   const [taskCounter, setTaskCounter] = useState()

    const [forData, setForData] = useState({
        firstName : '',
        lastName : '',
        role: '',
        groupId: '',
        taskCounter: ''
    })

    console.log("edit user ", cookies.editUser)
    console.log("cookies user", cookies.UserId)
    console.log("location", window.location.href)
    
    const instance = axios.create({  //экземпляр запроса с использованием текущего токена
        baseURL: "/user",
        timeout: 1000,
        headers: {'Authorization': 'Bearer '+ cookies.AuthToken}
      });
    
      const getUserEdit = async () => { // получить данные пользователя по его ID
        try {
    
            const response = await instance.get(`/${cookies.editUser}`)
        
            setFromData({
                firstName : response.data.firstName,
                lastName : response.data.lastName,
                groupId: response.data.groupName,
                role : response.data.role,
                groupName: response.data.groupNam
            })
        }
        catch(error) {
          console.log(error)
        }
      }
      
      const handleClick = async (e) => { //запрос на изменения пользователя
        e.preventDefault()
        const response = await instance.post('/modify', {
            id : cookies.editUser,
            firstName : firstName,
            lastName : lastName
        })
        getUserEdit()
      }

      useEffect(() => {
          getUserEdit()
      }, [])

    return (
        <>
        <AdminBar/>
            <div className="user">
                <SideBarAdmin/>
                <div className="userContainer">
                <div className="userTitleContainer">
                    <h2 className="userTitle">Изменения пользователя</h2>
                    {/* <Link to="/admin/newUser">
                        <button className="userAddButton">Создать</button>
                    </Link> */}
                </div>
                <div className="userShow">
                    <div className="userShowTop">
                        <div className="userShowTopTitle">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/149/149071.png?auto=compress&cs=tinysrgb&dpr=2&w=500"
                                alt=""
                                className="userShowImg"
                            />
                            <span className="userShowUserName">{fromData.firstName + fromData.lastName}</span>
                            <span className="userShowUserTitle">{fromData.groupId ? fromData.groupId : "Нет группы"}</span>
                        </div>
                    </div>
                    <div className="userDetails">
                        <div className="userShowButton">
                            <span className="userShowTitle"><b>Данные пользователя:</b></span> 
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>Имя: </b>{fromData.firstName}</span>
                            </div>
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>Фамилия: </b>{fromData.lastName}</span>
                            </div>
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>Группа: </b>{fromData.groupId ? fromData.groupId : "Нет группы"}</span>
                            </div>
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>Количество выполненных заданий: </b> 5</span>
                            </div>
                        </div>
                        <div className="userUpdate">
                            <span className="userUpdateTitle">Изменить:</span>
                            <form  className="userUpdateForm">
                                <div className="userUpdateLeft">
                                    <div className="userUpdateItem">
                                        <label>Имя: </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            onChange={e => setFirstName(e.target.value)}
                                            placeholder={fromData.firstName}
                                            className="userUpdateInput"
                                        />
                                    </div>
                                    <div className="userUpdateItem">
                                        <label>Фамилия: </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            onChange={e => setLastName(e.target.value)}
                                            placeholder={fromData.lastName}
                                            className="userUpdateInput"
                                        />
                                    </div>
                                    <div className="userUpdateItem">
                                        <label>Группа: </label>
                                        <input
                                            name="groupId"
                                            onChange={e => setGroupId(e.target.value)}
                                            type="text"
                                            placeholder={fromData.groupId ? fromData.groupId : "Нет группы"}
                                            className="userUpdateInput"
                                        />
                                    </div>
                                    <div className="userUpdateItem">
                                        <label>Количество выполненных заданий: </label>
                                        <input
                                            name="taskCounter"
                                            onChange={e => setTaskCounter(e.target.value)}
                                            type="text"
                                            placeholder={fromData.taskCounter}
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

export default User;