import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
// import React, {useState, useEffect} from "react";
// import axios from 'axios'

const UserList = () => {


  // const [data, setData] = useState()

  // const  TaskDataResponse = async () => { 
  //   const result = await axios.get('./users')
  //   console.log(result.data)
  //   setData(result.data)
  // }

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