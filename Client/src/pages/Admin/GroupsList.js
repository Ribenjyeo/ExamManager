import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";
// import axios from 'axios'

const GroupList = () => {
  const [cookies, setCookies, removeCookies] = useCookies(['user']);
  let [groupList, setGroupList] = useState()

  const groups = async () => { //запрос на получение пользователей
    const response = await fetch('/groups', {method: 'POST', headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
    const json = await response.json()
    const stringi = JSON.stringify(json)
    const parse = JSON.parse(stringi)
    setGroupList(parse.groups)
  }

  useEffect(() => {
    groups()
  }, [])

  const columns = [
    { field: 'id', headerName: 'ID', width: 300},
    { field: 'name', headerName: 'Название группы', width: 250},
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
    }]

    return(
        <>
        <AdminBar/>
            <div className="AdminContainer">
                <SideBarAdmin/>
                <div className="others">  
                <div style={{ height: '100%', width: '100%' }}>
                  <DataGrid
                    rows={groupList}
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