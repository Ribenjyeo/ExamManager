import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";
import AddTasks from "../../components/AddTasks";

const TaskList = () => {
  const [pageSize, setPageSize] = useState(10)
  const [cookies, setCookies, removeCookies] = useCookies(['user'])
  let [taskList, setTaskList] = useState({
      title : null,
      description: null,
    })

  const [taskItem, setTaskItem] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const tasks = async () => { //Получение всех заданий
      const response = await fetch('/tasks', {method: "POST", headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
      const json = await response.json()
      const stringi = JSON.stringify(json)
      const parse = JSON.parse(stringi)
      setTaskList(parse.tasks)
  }

  console.log(taskItem)

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
    tasks()
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
  }, [])

  const columns = [
      { field: 'id', headerName: <b>ID</b>, minWidth: 100, flex: 1},
      { field: 'title', headerName: <b>Название</b>, minWidth: 100, flex: 1},
      { field: 'description', headerName: <b>Описание</b>, minWidth: 100, flex: 1},
      {
        field: 'action',
        headerName: <b>Изменить / Удалить</b>,
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

  return(
      <>
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
