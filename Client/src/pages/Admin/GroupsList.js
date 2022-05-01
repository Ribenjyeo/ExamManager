import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
// import React, {useState, useEffect} from "react";
// import axios from 'axios'

const GroupList = () => {

      // const [data, setData] = useState()

  // const  GroupDataResponse = async () => { 
  //   const result = await axios.get('./group/')
  //   console.log(result.data)
  //   setData(result.data)
  // }



  const columns = [
    { field: 'id', headerName: 'ID', width: 200},
    { field: 'name', headerName: 'Название группы', width: 350},
    { field: 'studentsCount', headerName: 'Количество студентов, состоящих в группе', width: 500},
    {
      field: 'action',
      headerName: 'Изменить/Удалить',
      width: 300,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/admin/task/"+params.row.id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteIcon className="userListDelete" onClick={() => handleDelete(params.row.id)}/>
          </>
        )
      }
    }
    
  ];
  
  const rows = [
    { id: 1, name: 'ИКБО-01-18', studentsCount: '30' },
    { id: 2, name: 'ИКБО-02-18', studentsCount: '33'},
    { id: 3, name: 'ИКБО-03-18', studentsCount: '20'},
    { id: 4, name: 'ИКБО-04-18', studentsCount: '24'},
    { id: 5, name: 'ИКБО-05-18', studentsCount: '15'},

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
                    rowsPerPageOptions={[4]}
                    checkboxSelection
                  />
                </div>
                </div>
            </div>
        </>
    )
};

export default GroupList;