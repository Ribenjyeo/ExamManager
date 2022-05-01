import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
// import React, {useState, useEffect} from "react";
// import axios from 'axios'

const TaskList = () => {

      // const [data, setData] = useState()

  // const  TaskDataResponse = async () => { 
  //   const result = await axios.get('./task/${id}')
  //   console.log(result.data)
  //   setData(result.data)
  // }

  // const handleDelete = async (id) => {
  //   const res = await axios.get(`./task/delete/${id}`)
  //   console.log('Задание удалено')
  // }

  const columns = [
    { field: 'id', headerName: 'ID', width: 100},
    { field: 'title', headerName: 'Название', width: 250},
    { field: 'description', headerName: 'Описание', width: 300},
    { field: 'taskStatus', headerName: 'Статус', width: 200},
    {field: 'authorId', headerName: 'ID автора задания', width: 200},
    {field: 'url', headerName: 'URL для перехода к ресурсу задания', width: 300},
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
    { id: 1, title: 'Пропингуй Google.com', description: 'Пинг (ping) – это время отклика сервера или другого компьютера на запрос вашего компьютера. Пинг зависит от скорости интернета и ширины пропускного канала провайдера. Если скорость низкая, то пинг будет высоким. Он влияет на все программы, которые используют подключение к Интернету. Например, если пинг высокий, то могут быть проблемы с голосовым общением посредством программы Skype, с работой видеоконференции и так далее.',
    taskStatus: 'Выполнено', authorId: '1', url: 'https://www.youtube.com' },
    { id: 2, title: 'Пропингуй Google.com', description: 'Пинг (ping) – это время отклика сервера или другого компьютера на запрос вашего компьютера. Пинг зависит от скорости интернета и ширины пропускного канала провайдера. Если скорость низкая, то пинг будет высоким. Он влияет на все программы, которые используют подключение к Интернету. Например, если пинг высокий, то могут быть проблемы с голосовым общением посредством программы Skype, с работой видеоконференции и так далее.',
    taskStatus: 'Просрочено', authorId: '1', url: 'https://www.youtube.com' },
    { id: 3, title: 'Пропингуй Google.com', description: 'Пинг (ping) – это время отклика сервера или другого компьютера на запрос вашего компьютера. Пинг зависит от скорости интернета и ширины пропускного канала провайдера. Если скорость низкая, то пинг будет высоким. Он влияет на все программы, которые используют подключение к Интернету. Например, если пинг высокий, то могут быть проблемы с голосовым общением посредством программы Skype, с работой видеоконференции и так далее.',
    taskStatus: 'Просрочено', authorId: '1', url: 'https://www.youtube.com' },
    { id: 4, title: 'Пропингуй Google.com', description: 'Пинг (ping) – это время отклика сервера или другого компьютера на запрос вашего компьютера. Пинг зависит от скорости интернета и ширины пропускного канала провайдера. Если скорость низкая, то пинг будет высоким. Он влияет на все программы, которые используют подключение к Интернету. Например, если пинг высокий, то могут быть проблемы с голосовым общением посредством программы Skype, с работой видеоконференции и так далее.',
    taskStatus: 'Просрочено', authorId: '1', url: 'https://www.youtube.com' }

  
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
                    rowsPerPageOptions={[7]}
                    checkboxSelection
                  />
                </div>
                </div>
            </div>
        </>
    )
};

export default TaskList;