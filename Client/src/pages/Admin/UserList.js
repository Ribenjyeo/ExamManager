import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import {useState, useEffect} from "react";
import axios from 'axios'
import { useCookies } from "react-cookie";
import cookie from "react-cookies";

const UserList = () => {
  const [cookies, setCookies, removeCookies] = useCookies(['user']);

  let [userList, setUserList] = useState({
    id : '',
    firstName: '',
    lastName : '',
    groupName : ''
  })

  const users = async () => { //запрос на получение пользователей
    const response = await fetch('/users', {headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
    const json = await response.json()
    const stringi = JSON.stringify(json)
    const parse = JSON.parse(stringi)
    setUserList(parse.users)  

  }

  useEffect(() => {
    users()
  }, [])

  // const handleDelete = async (id) => {
  //   const res = await axios.get(`./users/delete/${id}`)
  //   console.log('Пользователь удален')
  // }


  const columns = [
    { field: 'id', headerName: 'ID', width: 300},
    { field: 'firstName', headerName: 'Имя', width: 350},
    { field: 'lastName', headerName: 'Фамилия', width: 350},
    { field: 'group', headerName: 'Группа', width: 350},
    {
      field: 'action',
      headerName: 'Изменить/Удалить',
      width: 300,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/admin/users/"+params.row.id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteIcon className="userListDelete" onClick={() => handleDelete(params.row.id)}/>
          </>
        )
      }
    }
    
  ];
  
  const rows = [
    { id: 1, lastName: 'Ахметов', firstName: 'Даниил', group: 'ИКБО-09-18' },
    { id: 2, lastName: 'Криусов', firstName: 'Денис', group: 'ИКБО-09-18' },
    { id: 3, lastName: 'Цаплина', firstName: 'Полина', group: 'ИКБО-09-18' },
    { id: 4, lastName: 'Дорофеев', firstName: 'Егор', group: 'ИКБО-09-18' },
    { id: 5, lastName: 'Мужинько', firstName: 'Владимир', group: 'ИКБО-09-18' },
  
  ];

    return(
        <>
        <AdminBar/>
            <div className="AdminContainer">
                <SideBarAdmin/>
                <div className="others">  
                <div style={{ height: '100%', width: '100%' }}>
                  <DataGrid
                    rows={userList}
                    disableSelectionOnClick
                    columns={columns}
                    pageSize={30}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                  />
                </div>
                </div>
            </div>
        </>
    )
};

export default UserList;