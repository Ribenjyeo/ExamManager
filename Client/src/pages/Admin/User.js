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
        groupName: '',
        taskCounter: ''
    })

    console.log(fromData)

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
    
    const instance = axios.create({  //экземпляр запроса с использованием текущего токена
        timeout: 1000,
        headers: {'Authorization': 'Bearer '+ cookies.AuthToken}
      });
    
      const getUserEdit = async () => { // получить данные пользователя по его ID
        try {
            const response = await instance.get(`/user/${cookies.editUser}`)
            if(response.data.role == 1 && response.data.groupId != null){
                const res = await instance.get(`/group/${response.data.groupId}`)
                setFromData({
                    firstName : response.data.firstName,
                    lastName : response.data.lastName,
                    groupId: response.data.groupId,
                    role : response.data.role,
                    groupName: res.data.name
                })
            }
            else{
                setFromData({
                    firstName : response.data.firstName,
                    lastName : response.data.lastName,
                    groupId: response.data.groupId,
                    role : response.data.role,
                })
            }   

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
        navigate("/admin/users")
      }

      useEffect(() => {
        getUserEdit()
    }, [])


    function handleStatus () {
        if(fromData.role == 0) return "Администратор"
        else if(fromData.role == 1) {
            if(fromData.groupName != null) return fromData.groupName
            else return "Нет группы"
        }   
    }

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
                            <span className="userShowUserName">{fromData.firstName + " " + fromData.lastName}</span>
                            <span className="userShowUserTitle">{handleStatus()}</span>
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
                                <span className="userShowInfoTitle"><b>Группа: </b>{fromData.groupName ? fromData.groupName : "Нет группы"}</span>
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
                                            placeholder={fromData.groupName ? fromData.groupName : "Нет группы"}
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