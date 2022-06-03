import * as React from "react";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector
  } from '@mui/x-data-grid';
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";

const AddTasks = ({ setShowModal, taskItem }) =>{
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    const [pageSize, setPageSize] = useState(10)
    let [userList, setUserList] = useState({
        firstName: null,
        lastName : null,
        groupName : null
    })

    let [students, setStudents] = useState([])

    const users = async () => { //Получение всех пользователей
    const response = await fetch('/users', {method: "POST", headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
    const json = await response.json()
    const stringi = JSON.stringify(json)
    const parse = JSON.parse(stringi)
    setUserList(parse.users)
    }

    const handleAddUserTask = async () => {
        if(students.length > 0) {

            let array = []
            for(let i = 0; i < taskItem.length; i++){
                array.push({id: taskItem[i]})
            }

            let addStudents = {
                tasks: array
            }

            for (let i = 0; i < students.length; i++) {
                const response = await fetch(`/user/${students[i]}/tasks/add`, {
                    method: "POST",
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : 'Bearer ' + cookies.AuthToken},
                        body: JSON.stringify(addStudents)
                    })
            }
            setShowModal(false)
        }
        else {
            console.log("выберите пользователей, которому нужно добавить задание")
        }
    }

    useEffect(() => {
        users()
    }, [])

    const handleClick = () => {
        setShowModal(false)
    }

    const columns = [
        { field: 'firstName', headerName: 'Имя', minWidth: 100, flex: 1},
        { field: 'lastName', headerName: 'Фамилия', minWidth: 100, flex: 1},
        { field: 'groupName', headerName: 'Группа', minWidth: 100, flex: 1}
    ];

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
            <div className="addtasks-modal">
                <div>
                    <div className="title">Выберите пользователей, который хотите присвоить задание</div>
                    <div className="close-icon" onClick={handleClick}>╳</div>
                </div>
                <div className="AddTaskdataGrid">
                    <DataGrid
                        rows={userList}
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
              <button className="AddTaskButton" onClick={(e) => handleAddUserTask(e)}>Добавить задание</button>
            </div>
        </>
    )
}

export default AddTasks