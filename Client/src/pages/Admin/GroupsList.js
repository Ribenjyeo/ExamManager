import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

const GroupList = () => {
  const [cookies, setCookies, removeCookies] = useCookies(['user']);
  const [groupList, setGroupList] = useState(
    {
      id: null,
      name: null,
      studentCount: null
    }
  )
  const [pageSize, setPageSize] = useState(10)

  const groups = async () => { //запрос на получение пользователей
    const response = await fetch('/groups', {method: 'POST', headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
    const json = await response.json()
    const stringi = JSON.stringify(json)
    const parse = JSON.parse(stringi)
    setGroupList(parse.groups)
  }

  function handleClick (params) { //получение ID изменяемого пользователя
    setCookies("editGroup", params)
  }

  const handleDelete = async (params) => {  //удаление группы
    const response = await axios.get(`/group/${params}/delete`, {headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
    groups()
  }

  useEffect(() => {
    groups()
    removeCookies('editGroup', {path:'/admin/groups'})
    removeCookies('editGroup', {path:'/admin'})
  }, [])

  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 100, flex: 1},
    { field: 'name', headerName: 'Название группы', minWidth: 100, flex: 1},
    { field: 'studentsCount', headerName: 'Количество студентов, состоящих в группе', width: 500},
    {
      field: 'action',
      headerName: 'Изменить/Удалить',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/admin/groups/"+params.row.id}>
              <button className="userListEdit" onClick={(e) => handleClick(params.row.id)}>Изменить</button>
            </Link>
            <DeleteIcon className="userListDelete" onClick={() => handleDelete(params.row.id)}/>
          </>
        )
      }
    }]

    function CustomToolbar() {
      return (
        <GridToolbarContainer>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
        </GridToolbarContainer>
      );
    }

    return(
        <>
        <AdminBar/>
            <div className="AdminContainer">
                <SideBarAdmin/>
                <div className="others">  
                <div className="userTitleContainer">
                    <h2 className="userTitle">Список групп:</h2>
                </div>
                  <div className="dataGrid">
                    <DataGrid
                      rows={groupList}
                      checkboxSelection
                      onSelectionModelChange={item => setStudents(item)}
                      columns={columns}
                      pageSize={pageSize}
                      components={{
                        Toolbar: CustomToolbar,
                      }}
                      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                      rowsPerPageOptions={[10, 25, 50]}
                    />
                  </div>
                </div>
            </div>
        </>
    )
};

export default GroupList;