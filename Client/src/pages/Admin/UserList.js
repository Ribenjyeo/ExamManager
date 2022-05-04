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
  const [fromData, setFromData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    role: '',	
    groupName: ''
  })

  let theArray = []

  const instance = axios.create({  //экземпляр запроса с использованием текущего токена
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer '+ cookies.AuthToken},
  })

  // let getusers = function () {
  //   let data = JSON.stringify(
  //     {
  //       id : "",
  //       firstName : "",
  //       lastName :"",
  //       groupName : ""
  //     }
  //   )

  //   const xmlhttp = new XMLHttpRequest()
  //   xmlhttp.open("GET", "/users")
  //   xmlhttp.setRequestHeader('Accept', 'application/javascript')
  //   xmlhttp.setRequestHeader('Content-Type', 'application/javascript')
  //   xmlhttp.setRequestHeader('Authorization', 'Bearer ' + cookies.AuthToken)
  //   xmlhttp.timeout = 1000

  //   xmlhttp.onload = function() { 
  //     onSccusess(JSON.parse(this.responseText))
  //   }

  //   xmlhttp.send(data)
  // }

  // let onSccusess = function (data) {
  //   console.log(data)
  // }

  const GetUsersRequest = async () => { 
    try {
      const response = await instance.get('/users', {
        params: {
        groupId: null,
        taskStatus: null,
        role: null
      }})
      .then( response => {
        const newItems = {
        id : response.data.id,
        firstName : response.data.firstNamem,
        lastName : response.data.lastName,
        groupName : response.data.groupName
      }
      theArray.push(newItems)
      })
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    GetUsersRequest()
    // getusers()
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
                    rows={rows}
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