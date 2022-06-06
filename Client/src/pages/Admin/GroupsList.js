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
import Alert from '@mui/material/Alert';
import ErrorIcon from '@mui/icons-material/Error';

const GroupList = () => {
  const [error, setError] = useState(false)
  const [textError, setTextError] = useState()
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
    if(response.data.type == "BadResponse") {
      setError(true)
      setTextError(response.data.message)
    }
    else{
      groups()
    }
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
      headerName: 'Подробнее/Удалить',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/admin/groups/"+params.row.id}>
              <button className="userListEdit" onClick={(e) => handleClick(params.row.id)}>Подробнее</button>
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
        {error && (<Alert
            severity="error"
            iconMapping={{success: <ErrorIcon fontSize="medium"/>}}
            onClose={(e) => {onClose()}}>
            <strong>Ошибка!</strong> {textError}. В ней есть студенты
        </Alert>)}
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