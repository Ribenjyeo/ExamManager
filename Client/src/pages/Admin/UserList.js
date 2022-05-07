import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";


const UserList = () => {
  const [pageSize, setPageSize] = useState(10)
  const [cookies, setCookies, removeCookies] = useCookies(['user'])
  let [userList, setUserList] = useState({
    id : null,
    firstName: null,
    lastName : null,
    groupName : null
  })
  const [user_id, setUser_id] = useState(false)
  const [groupName, setGroupName] = useState({
    id: null,
    name: null
  })
  let [groupList, setGroupList] = useState([])
  let [students, setStudents] = useState([])

  const users = async () => { //Получение всех пользователей
    const response = await fetch('/users', {method: "POST", headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
    const json = await response.json()
    const stringi = JSON.stringify(json)
    const parse = JSON.parse(stringi)
    setUserList(parse.users)
  }

  const groups = async () => { //запрос на получение групп
    const response = await fetch('/groups', {method: 'POST', headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
    const json = await response.json()
    const stringi = JSON.stringify(json)
    const parse = JSON.parse(stringi)
    setGroupList(parse.groups)
  }

  const handleDelete = async (params) => { //Удаление пользователя
    const deleteUser = {
      'users' : [{
        id: params,
        onlyLogin: false
        }]
      }
    const response = await fetch('/users/delete', {
      method: "POST",
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + cookies.AuthToken},
        body: JSON.stringify(deleteUser)
      })
    users()
  }

  const handleAddStudents = async () => { //Добавление пользователей в группу
    groups() //Получение списка групп
    let check = false
    let currentGroupId = null
    for (let i = 0; i < groupList.length; i++){
      if(groupList[i].name === groupName.name) {
        check = true
        currentGroupId = groupList[i].id
      }
    }

    if(check) {
      let array = []
      for(let i = 0; i < students.length; i++){
          array.push({id: students[i]})
      }

      console.log("aaray: ", array)

      let AddStudentsRequest = {
        groupId : currentGroupId,
        students : array
      }

      console.log(JSON.stringify(AddStudentsRequest))

      const response = fetch('/group/students/add', {
        method: "POST",
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + cookies.AuthToken},
          body: JSON.stringify(AddStudentsRequest)
        })
      users()
      console.log(userList)
    }
  }

  function handleClick (params) { //получение ID изменяемого пользователя
    setCookies("editUser", params)
  }

  console.log(userList)

  useEffect(() => {
    users()
    removeCookies('editUser', {path:'/admin/users'})
    removeCookies('editUser', {path:'/admin'})
    removeCookies('editUser', {path:'/'})
    groups()
  }, [])
  
  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 100, flex: 1},
    { field: 'firstName', headerName: 'Имя', minWidth: 100, flex: 1},
    { field: 'lastName', headerName: 'Фамилия', minWidth: 100, flex: 1},
    { field: 'groupName', headerName: 'Группа', minWidth: 100, flex: 1},
    {
      field: 'action',
      headerName: 'Изменить / Добавить задание / Удалить',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/admin/users/"+params.row.id}>
              <button className="userListEdit" onClick={(e) => handleClick(params.row.id)}>Изменить</button>
            </Link>
            <Link to={`/admin/${params.row.id}/newTask`}>
              <button className="userListEdit" onClick={(e) => handleClick(params.row.id)}>Добавить задание</button>
            </Link>
            <DeleteIcon className="userListDelete" onClick={() => handleDelete(params.row.id)}/>
          </>
        )
      }
    }];

    return(
        <>
        <AdminBar/>
            <div className="AdminContainer">
                <SideBarAdmin/>
                <div className="others"> 
                <div className="userTitleContainer">
                    <h2 className="userTitle">Список пользователей:</h2>
                    <input type="text" className="groupName" placeholder="Название группы" onChange={e => setGroupName({name : e.target.value || null})}/>
                    <button className="userAddGroupButton" onClick={(e) => handleAddStudents(e)}>Добавить в группу</button>
                </div>
                <div className="dataGrid">
                  <DataGrid
                    rows={userList}
                    checkboxSelection
                    onSelectionModelChange={item => setStudents(item)}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 25, 50]}
                  />
                </div>
                </div>
            </div>
        </>
    )
};

export default UserList;