import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { Link } from 'react-router-dom'
import { useState, useEffect} from 'react'
import { useCookies } from "react-cookie";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';

const User = () => {
    let navigate = useNavigate()
    const [pageSize, setPageSize] = useState(5)
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    const [fromData, setFromData] = useState({
        firstName : '',
        lastName : '',
        role: '',
        groupId: '',
        groupName: '',
    })

   const [firstName, setFirstName] = useState()
   const [lastName, setLastName] = useState()
   const [role, setRole] = useState()
   const [groupId, setGroupId] = useState()

    const [forData, setForData] = useState({
        firstName : '',
        lastName : '',
        role: '',
        groupId: '',
    })

    const [tasks, setTasks] = useState([])

    const instance = axios.create({  //экземпляр запроса с использованием текущего токена
        timeout: 1000,
        headers: {'Authorization': 'Bearer '+ cookies.AuthToken}
      });
    
      const getUserEdit = async () => { // получить данные пользователя по его ID
        try {
            const response = await instance.get(`/user/${cookies.editUser}`)
            setTasks(response.data.tasks) 
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

      const handleDelete = async (params) => { //Удаление задания у пользователя
        const deleteTask = {taskId: params}
        console.log(deleteTask)
        const response = await fetch('/task/delete', {
            method: "POST",
            headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + cookies.AuthToken},
            body: JSON.stringify(deleteTask)
        })
        getUserEdit() //Обновить список пользователей на странице
      }

      useEffect(() => {
        getUserEdit()
        removeCookies('editUser', {path:'/admin/user/:userId'})
    }, [])


    function handleStatus () { //Отображение группы пользоватея / его роли
        if(fromData.role == 0) return "Администратор"
        else if(fromData.role == 1) {
            if(fromData.groupName != null) return fromData.groupName
            else return "Нет группы"
        }   
    }

    function handleClickTask (params) { //получение ID изменяемого задания
        setCookies("editTask", params)
      }
    

    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 100, flex: 1},
        { field: 'title', headerName: 'Название задания', minWidth: 100, flex: 1},
        {
          field: 'action',
          headerName: 'Изменить / Удалить',
          minWidth: 100,
          flex: 1,
          renderCell: (params) => {
            return (
              <>
                <Link to={"/admin/tasks/"+params.row.id}>
                  <button className="userListEdit" onClick={(e) => handleClickTask(params.row.id)}>Изменить</button>
                </Link>
                <DeleteIcon className="userListDelete" onClick={() => handleDelete(params.row.id)}/>
              </>
            )
          }
        }];
 
    return (
        <>
        <AdminBar/>
            <div className="user">
                <SideBarAdmin/>
                <div className="userContainer">
                <div className="userTitleContainer">
                    <h2 className="userTitle">Изменения пользователя</h2>
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
                                </div>
                                <div className="editUser">
                                    <button className="buttonEditUser" onClick={(e) => {handleClick(e)}}>Внести изменения</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    </div>
                    <div className="dataGridTask">
                        <DataGrid
                            rows={tasks}
                            checkboxSelection
                            // onSelectionModelChange={item => setStudents(item)}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                            rowsPerPageOptions={[5, 10, 20]}
                        />
                </div>
                </div>
            </div>
        </>
    );
};

export default User;