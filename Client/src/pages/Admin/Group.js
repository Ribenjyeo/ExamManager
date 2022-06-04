import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";

const Group = () => {
    const [pageSize, setPageSize] = useState(10)
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    let [userList, setUserList] = useState({
    id : null,
    firstName: null,
    lastName : null,
    groupName : null
    })

    const usersInGroup = async () => { //Получение всех пользователей в группе
        const response = await fetch(`/group/${cookies.editGroup}/students`, {
            method: "GET",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + cookies.AuthToken}
            })
        const json = await response.json()
        const stringi = JSON.stringify(json)
        const parse = JSON.parse(stringi)
        setUserList(parse.users)
      }

    const handleDelete = async (params) => { //Удаление пользователя из группы
    const deleteUser = {
        'students' : [{
        id: params
        }]
        }
    const response = await fetch('/group/students/remove', {
        method: "POST",
        headers: {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + cookies.AuthToken},
        body: JSON.stringify(deleteUser)
        })
    usersInGroup() //Обновить список пользователей в группе
    }

    function handleClick (params) { //получение ID изменяемого пользователя
    setCookies("editUser", params)
    }

    useEffect(() => {
        usersInGroup()
        removeCookies('editUser', {path:'/admin/users'})
        removeCookies('editUser', {path:'/admin'})
        removeCookies('editUser', {path:'/'})
      }, [])

    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 100, flex: 1},
        { field: 'firstName', headerName: 'Имя', minWidth: 100, flex: 1},
        { field: 'lastName', headerName: 'Фамилия', minWidth: 100, flex: 1},
        { field: 'groupName', headerName: 'Группа', minWidth: 100, flex: 1},
        {
          field: 'action',
          headerName: 'Изменить / Удалить',
          minWidth: 100,
          flex: 1,
          renderCell: (params) => {
          return (
            <>
            <Link to={"/admin/users/"+params.row.id}>
                <button className="userListEdit" onClick={(e) => handleClick(params.row.id)}>Изменить</button>
            </Link>
            <DeleteIcon className="userListDelete" onClick={() => handleDelete(params.row.id)}/>
            </>
          )
        }
    }];

    return(
        <>
         <AdminBar/>
            <div className="user">
                <SideBarAdmin/>
                <div className="userContainer">
                    <div className="userTitleContainer">
                        <h2 className="userTitle">{"Студенты группы: "}</h2>
                    </div>
                    <div className="dataGrid">
                    <DataGrid
                        rows={userList}
                        checkboxSelection
                        disableSelectionOnClick
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
}

export default Group;