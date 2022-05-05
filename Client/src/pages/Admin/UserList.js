import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";

const UserList = () => {
  const [cookies, setCookies, removeCookies] = useCookies(['user'])
  let [userList, setUserList] = useState({
    id : '',
    firstName: '',
    lastName : '',
    groupName : ''
  })
  const [user_id, setUser_id] = useState(false)

  const users = async () => { //Получение всех пользователей
    const response = await fetch('/users', {method: "POST", headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
    const json = await response.json()
    const stringi = JSON.stringify(json)
    const parse = JSON.parse(stringi)
    setUserList(parse.users)  

  }

  useEffect(() => {
    users()
  }, [])

  // const handleDelete = async (id) => { //Удаление пользователя
  //   const res = await axios.get(`./users/delete/${id}`)
  //   console.log('Пользователь удален')
  // }

  function handleClick (params) { //получение ID изменяемого пользователя
    setCookies("editUser", params)
  }
  
  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 100, flex: 1},
    { field: 'firstName', headerName: 'Имя', minWidth: 100, flex: 1},
    { field: 'lastName', headerName: 'Фамилия', minWidth: 100, flex: 1},
    { field: 'group', headerName: 'Группа', minWidth: 100, flex: 1},
    {
      field: 'action',
      headerName: 'Изменить/Удалить',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/admin/users/"+params.row.id}>
              <button className="userListEdit" onClick={() => handleClick(params.row.id)}>Edit</button>
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
                <div className="dataGrid">
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