import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";


const TaskList = () => {
  const [cookies, setCookies, removeCookies] = useCookies(['user'])
  let [taskList, setTaskList] = useState({
    id : '',
    firstName: '',
    lastName : '',
    groupName : ''
  })

  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 100, flex: 1},
    { field: 'title', headerName: 'Название', minWidth: 100, flex: 1},
    { field: 'description', headerName: 'Описание', minWidth: 100, flex: 1},
    { field: 'taskStatus', headerName: 'Статус', minWidth: 100, flex: 1},
    {field: 'authorId', headerName: 'ID автора задания', minWidth: 100, flex: 1},
    {field: 'url', headerName: 'URL для перехода к ресурсу задания', minWidth: 100, flex: 1},
    {
      field: 'action',
      headerName: 'Изменить/Удалить',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/admin/task/"+params.row.id}>
              <button className="userListEdit">Изменить</button>
            </Link>
            <DeleteIcon className="userListDelete" onClick={() => handleDelete(params.row.id)}/>
          </>
        )
      }
    }
    
  ];
  
  // const rows = [
  //   { id: 1, title: 'Пропингуй Google.com', description: 'Пинг (ping) – это время отклика сервера или другого компьютера на запрос вашего компьютера. Пинг зависит от скорости интернета и ширины пропускного канала провайдера. Если скорость низкая, то пинг будет высоким. Он влияет на все программы, которые используют подключение к Интернету. Например, если пинг высокий, то могут быть проблемы с голосовым общением посредством программы Skype, с работой видеоконференции и так далее.',
  //   taskStatus: 'Выполнено', authorId: '1', url: 'https://www.youtube.com' },
  //   { id: 2, title: 'Пропингуй Google.com', description: 'Пинг (ping) – это время отклика сервера или другого компьютера на запрос вашего компьютера. Пинг зависит от скорости интернета и ширины пропускного канала провайдера. Если скорость низкая, то пинг будет высоким. Он влияет на все программы, которые используют подключение к Интернету. Например, если пинг высокий, то могут быть проблемы с голосовым общением посредством программы Skype, с работой видеоконференции и так далее.',
  //   taskStatus: 'Просрочено', authorId: '1', url: 'https://www.youtube.com' },
  //   { id: 3, title: 'Пропингуй Google.com', description: 'Пинг (ping) – это время отклика сервера или другого компьютера на запрос вашего компьютера. Пинг зависит от скорости интернета и ширины пропускного канала провайдера. Если скорость низкая, то пинг будет высоким. Он влияет на все программы, которые используют подключение к Интернету. Например, если пинг высокий, то могут быть проблемы с голосовым общением посредством программы Skype, с работой видеоконференции и так далее.',
  //   taskStatus: 'Просрочено', authorId: '1', url: 'https://www.youtube.com' },
  //   { id: 4, title: 'Пропингуй Google.com', description: 'Пинг (ping) – это время отклика сервера или другого компьютера на запрос вашего компьютера. Пинг зависит от скорости интернета и ширины пропускного канала провайдера. Если скорость низкая, то пинг будет высоким. Он влияет на все программы, которые используют подключение к Интернету. Например, если пинг высокий, то могут быть проблемы с голосовым общением посредством программы Skype, с работой видеоконференции и так далее.',
  //   taskStatus: 'Просрочено', authorId: '1', url: 'https://www.youtube.com' }

  
  // ];


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