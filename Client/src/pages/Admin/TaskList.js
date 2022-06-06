import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";
import AddTasks from "../../components/AddTasks";
import axios from "axios";
import Alert from '@mui/material/Alert';
import ErrorIcon from '@mui/icons-material/Error';


const TaskList = () => {
  const [error, setError] = useState(false)
  const [textError, setTextError] = useState()
  const [pageSize, setPageSize] = useState(10)
  const [cookies, setCookies, removeCookies] = useCookies(['user'])
  let [taskList, setTaskList] = useState({
      title : null,
      description: null,
    })

  const [taskItem, setTaskItem] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const instance = axios.create({  //экземпляр запроса с использованием текущего токена
    timeout: 1000,
    headers: {'Authorization': 'Bearer '+ cookies.AuthToken}
});

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
    const response = await axios.post('/task/delete', JSON.stringify(deleteUser), {
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + cookies.AuthToken}
      })

    if(response.data.type == "BadResponse") {
      setError(true)
      setTextError(response.data.message)
    }
    else{
      tasks()
    }
  }

  const handleAddUserTask = () => {
    if(taskItem.length > 0) {
      setShowModal(true)
    }
    else {
      console.log("Выберите задание")
    }
  }

  function handleClick (params) { //получение ID изменяемого пользователя
    setCookies("editTask", params)
  }

  useEffect(() => {
    tasks()
    removeCookies('editTask', {path:'/'})
    removeCookies('editTask', {path:'/admin/task'})
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
              <DeleteIcon className="userListDelete" onClick={() => handleDelete(params.row.id)}/>
            </>
          )
        }
      }];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </GridToolbarContainer>
    );
  }
  
  function onClose () {
    setError(false)
  }

  return(
      <>
      {error && (<Alert
        severity="error"
        iconMapping={{success: <ErrorIcon fontSize="medium"/>}}
        onClose={(e) => {onClose()}}><strong>Ошибка!</strong> {textError}</Alert>)}
      <AdminBar/>
          <div className="AdminContainer">
              <SideBarAdmin/>
              <div className="others"> 
              <div className="userTitleContainer">
                  <h2 className="userTitle">Список заданий:</h2>
                  <button className="userAddTaskButton" onClick={(e) => handleAddUserTask(e)}>Добавить задание пользователям</button>
              </div>
              {showModal && (
                <AddTasks setShowModal={setShowModal} taskItem={taskItem}/>
              )}
              <div className="dataGrid">
                <DataGrid
                  rows={taskList}
                  checkboxSelection
                  onSelectionModelChange={item => setTaskItem(item)}
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
}

export default TaskList
