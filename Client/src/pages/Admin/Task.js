import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Editor } from '../../components/ckeditor5/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 1 ,
    boxShadow: 24,
    p: 4,
  };

const Task = () => {
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    const [toggleTitle, setToggleTitle] = useState(true);
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [data, setData] = useState({
        id: '',
        title: '',
        description: '',
        virtualMachine: [{
            id: ''
        }],
        students: [{
            id: '',
            fullName: ''
        }]
    })

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const instance = axios.create({  //экземпляр запроса с использованием текущего токена
        timeout: 1000,
        headers: {'Authorization': 'Bearer '+ cookies.AuthToken}
    });

    const getTask = async () => { // получить данные задания
        try {
            const response = await axios.get(`/task/${cookies.editTask}`, {headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + cookies.AuthToken}
              })
            // console.log(response.data)
            setData({
                id: response.data.id,
                title: response.data.title,
                description: response.data.description,
                // virtualMachine: [{
                //     id: response.data.virtualMachine[0].id
                // }],
                students: response.data.students.length > 0 ? response.data.students : [{fullName: 'Это задание не присвоено пользователям'}]
            })
        }
        catch(error) {
            console.log(error)
        }
    }

    const handleClick = async (e) => { //запрос на изменения задания
        e.preventDefault()
        const res = await instance.post('/task/modify', { 
            taskId : cookies.editTask,
            title : title,
            description : description
        })
        window.location.reload()
    }

    function toggleInput() {
        setToggleTitle(false)
    }

    const handleChangeData = (e, editor) => {
        const data = editor.getData()
        setDescription(data)
    }

    const getLinkUser = (params) => { //получение ID изменяемого пользователя
    setCookies("editUser", params)
    }

    useEffect(() => {
        getTask()
        removeCookies('editUser', {path:'/admin/users'})
        removeCookies('editUser', {path:'/admin'})
        removeCookies('editUser', {path:'/'})
    }, [])

    return (
        <>
            <AdminBar/>
            <div className="user">
                <SideBarAdmin/>
                <div className="userContainer">
                <div className="userTitleContainer">
                    <h2 className="userTitle">Изменения задания</h2>
                </div>
                <div className="userShow">
                    <div className="userShowTop">
                    </div> 
                    <div className="userDetails">
                        <div className="userShowButton">
                            <span className="userShowTitle"><b>Данные задания:</b></span> 
                            <div className="userShowInfo">
                                <label><b>Название задания:</b></label>
                                {toggleTitle ? (
                                    <span className="userShowInfoTitle" onDoubleClick={toggleInput}>{data.title}</span>
                                ) : (
                                    <input
                                        type="text"
                                        name="title"
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder={data.title}
                                        className="taskUpdateInput"
                                    />
                                )}
                            </div>
                            <div className="userShowInfo">
                                <Button className="connect-button" name="connectbtn" variant="outlined" onClick={handleOpen}>Список пользователей</Button>
                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={style}>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            Список пользователей, которые используют это задание:
                                        </Typography>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                            {data.students.map((item, i) => 
                                              <Link to={"/admin/users/"+item.id} onClick={getLinkUser(item.id)} style={{ color: 'black', textDecoration: 'none' }}><p>{item.fullName}</p></Link>
                                            )}
                                        </Typography>
                                    </Box>
                                </Modal>
                            </div>
                            <div className="CKeditor">
                            <label><b>Описание задания</b></label>
                            <div className="editor-data">
                              <CKEditor editor={Editor} data={data.description}  onChange={handleChangeData}/>
                            </div>
                        </div>
                            <div className="editUser">
                                <button className="buttonEditUser" onClick={(e) => {handleClick(e)}}>Внести изменения</button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Task