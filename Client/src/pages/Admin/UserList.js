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
    removeCookies({"editUser" : cookies.editUser})
  }

  useEffect(() => {
    users()
  }, [])

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
            <div className="AdminContainer">
                <SideBarAdmin/>
                <div className="others">  
                <div className="dataGrid">
                  <DataGrid
                    rows={userList}
                    checkboxSelection
                    onSelectionModelChange={itm => console.log(itm)} 
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5]}
                  />
                </div>
                </div>
            </div>
        </>
    )
};

export default UserList;