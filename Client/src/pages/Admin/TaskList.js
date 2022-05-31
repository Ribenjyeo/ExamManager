import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";

const TaskList = () => {
    const [pageSize, setPageSize] = useState(10)
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    let [taskList, setTaskList] = useState({
        title : null,
        description: null,
      })


    const tasks = async () => { //Получение всех заданий
        const response = await fetch('/tasks', {method: "POST", headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
        const json = await response.json()
        const stringi = JSON.stringify(json)
        const parse = JSON.parse(stringi)
        setTaskList(parse.tasks)
    }

    const handleDelete = async (params) => { //Удаление задания
      const deleteUser = {
        taskId : params
        }
      const response = await fetch('/task/delete', {
        method: "POST",
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + cookies.AuthToken},
          body: JSON.stringify(deleteUser)
        })
      window.location.reload()
    }
  

    function handleClick (params) { //получение ID изменяемого пользователя
      setCookies("editTask", params)
    }

    useEffect(() => {
      tasks()
    }, [])

    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 100, flex: 1},
        { field: 'title', headerName: 'Название', minWidth: 100, flex: 1},
        { field: 'description', headerName: 'Описание', minWidth: 100, flex: 1},
        {
          field: 'action',
          headerName: 'Изменить / Удалить',
          minWidth: 100,
          flex: 1,
          renderCell: (params) => {
            return (
              <>
                <Link to={"/admin/task/"+params.row.id}>
                  <button className="userListEdit" onClick={(e) => handleClick(params.row.id)}>Изменить</button>
                </Link>
                <Link to={`/admin/${params.row.id}/newTask`}>
                  <button className="userListEdit" onClick={(e) => handleClick(params.row.id)}>Добавить задание</button>
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
                <div className="userTitleContainer">
                    <h2 className="userTitle">Список заданий:</h2>
                </div>
                <div className="dataGrid">
                  <DataGrid
                    rows={taskList}
                    checkboxSelection
                    onSelectionModelChange={item => setStudents(item)}
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

export default TaskList
