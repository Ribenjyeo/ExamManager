import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { useState, useEffect} from 'react'
import { useCookies } from "react-cookie";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import photo from "../../img/userShowImg.png"

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
    const [groupId, setGroupId] = useState(null)
    const [forData, setForData] = useState({
        firstName : '',
        lastName : '',
        role: '',
        groupId: '',
    })
    const [groupList, setGroupList] = useState([])
    const [tasks, setTasks] = useState([])
    const [toggleFirstName, setToggleFirstName] = useState(true);
    const [toggleLastName, setToggleLastName] = useState(true);
    const [toggleGroup, setToggleGroup] = useState(true);

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
                    groupName : null
                })
            }   
        }
        catch(error) {
            console.log(error)
        }
    }

    const groups = async () => { //запрос на получение групп
        const response = await fetch('/groups', {method: 'POST', headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
        const json = await response.json()
        const stringi = JSON.stringify(json)
        const parse = JSON.parse(stringi)
        setGroupList(parse.groups)
    }
      
    const handleClick = async (e) => { //запрос на изменения пользователя
        e.preventDefault()
        if(groupId !== null) { //Если мы решили поменять группу у отдельного студента
            let currentGroupId = null
            let check = false
            // console.log(groupList)
            for (let i = 0; i < groupList.length; i++){  //Поиск совпадений в изменяемой группе
                if(groupList[i].name === groupId) {
                    check = true
                    currentGroupId = groupList[i].id
                }
            }
            console.log(check)
            if(check) {
                if(fromData.groupId !== null) { //Если студент уже состоит в группе, то убираем его из неё
                    let RemoveStudentsRequest = {
                        students : [{id: cookies.editUser}]
                    }

                    const response = fetch('/group/students/remove', {
                        method: "POST",
                        headers: {
                          'Content-Type' : 'application/json',
                          'Authorization' : 'Bearer ' + cookies.AuthToken},
                          body: JSON.stringify(RemoveStudentsRequest)
                        })
                }  

                let AddStudentsRequest = {
                    groupId : currentGroupId,
                    students : [{id: cookies.editUser}]
                  }

                const response = fetch('/group/students/add', { //Добавление студента в группу
                    method: "POST",
                    headers: {
                      'Content-Type' : 'application/json',
                      'Authorization' : 'Bearer ' + cookies.AuthToken},
                      body: JSON.stringify(AddStudentsRequest)
                    })
            }  
        }
        const res = await instance.post('/user/modify', { //Изменение  данных пользователя
            id : cookies.editUser,
            firstName : firstName,
            lastName : lastName,
        })
        window.location.reload()
    }

    const handleDelete = async (params) => { //Удаление задания у пользователя
        let array = []
        array.push({id: params})

        let deleteTask = {
            personalTasks: array
        }
        const response = await fetch(`/user/${cookies.editUser}/tasks/remove`, {
            method: "POST",
            headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + cookies.AuthToken},
            body: JSON.stringify(deleteTask)
        })
        GetTaskList()
    }

    const GetTaskList = async () => {
        const response = await fetch(`/user/${cookies.editUser}/tasks`, {method: "GET", headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
        const json = await response.json()
        const stringi = JSON.stringify(json)
        const parse = JSON.parse(stringi)
        const array = parse.personalTasks[0].tasks
        for(let i = 0; i < array.length; i++) {
            if(array[i].status == 1) {
                array[i].status = "Не завершено"
            }
            else {
                array[i].status = "Выполнено"
            }
        }
        setTasks(parse.personalTasks[0].tasks)
    }

    useEffect(() => {
        getUserEdit()
        GetTaskList()
        removeCookies('editUser', {path:'/admin/user/:userId'})
        groups()
    }, [])


    function handleStatus () { //Отображение группы пользоватея / его роли
        if(fromData.role == 0) return "Администратор"
        else if(fromData.role == 1) {
            if(fromData.groupName != null) return fromData.groupName
            else return "Нет группы"
        }   
    }
    
    function toggleInputFirstName() {
        setToggleFirstName(false);
    }

    function toggleInputLastName() {
        setToggleLastName(false);
    }

    function toggleInputGroup() {
        setToggleGroup(false);
    }
    const columns = [
        { field: 'title', headerName: <b>Название задания</b>, minWidth: 100, flex: 1},
        { field: 'description', headerName: <b>Описание задания</b>, minWidth: 100, flex: 1},
        { field: 'number', headerName: <b>Внутренний номер задания</b>, minWidth: 100, flex: 1},
        { field: 'status', headerName: <b>Статус задания</b>, minWidth: 100, flex: 1},
        {
          field: 'action',
          headerName: <b>Убрать задание</b>,
          minWidth: 100,
          flex: 1,
          renderCell: (params) => {
            return (
              <>
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
                                src={photo}
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
                                <label><b>Имя:</b></label>
                                {toggleFirstName ? (
                                    <span className="userShowInfoTitle" onDoubleClick={toggleInputFirstName}>{fromData.firstName}</span>
                                ) : (
                                    <input
                                        type="text"
                                        name="firstName"
                                        onChange={e => setFirstName(e.target.value)}
                                        placeholder={fromData.firstName}
                                        className="userUpdateInput"
                                    />
                                )}
                            </div>
                            <div className="userShowInfo">
                                <label><b>Фамилия:</b></label>
                                {toggleLastName ? (
                                    <span className="userShowInfoTitle" onDoubleClick={toggleInputLastName}>{fromData.lastName}</span>
                                ) : (
                                    <input
                                        type="text"
                                        name="lastName"
                                        onChange={e => setLastName(e.target.value)}
                                        placeholder={fromData.lastName}
                                        className="userUpdateInput"
                                    />
                                )}
                            </div>
                            <div className="userShowInfo">
                                <label><b>Группа :</b></label>
                                {toggleGroup ? (
                                    <span className="userShowInfoTitle" onDoubleClick={toggleInputGroup}>{fromData.groupName ? fromData.groupName : "Нет группы"}</span>
                                ) : (
                                    <input
                                        name="groupId"
                                        onChange={e => setGroupId(e.target.value)}
                                        type="text"
                                        placeholder={fromData.groupName ? fromData.groupName : "Нет группы"}
                                        className="userUpdateInput"
                                    />
                                )}
                            </div>
                            <div className="editUser">
                                    <button className="buttonEditUser" onClick={(e) => {handleClick(e)}}>Внести изменения</button>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="dataGridTask">
                        <DataGrid
                            rows={tasks}
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