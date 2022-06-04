import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Editor } from '../../components/ckeditor5/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const Task = () => {
    const [cookies, setCookies, removeCookies] = useCookies(['user'])
    const [toggleTitle, setToggleTitle] = useState(true);
    const [title, setTitle] = useState(null)
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

    const instance = axios.create({  //экземпляр запроса с использованием текущего токена
        timeout: 1000,
        headers: {'Authorization': 'Bearer '+ cookies.AuthToken}
    });

    const getTask = async () => { // получить данные задания
        try {
            const response = await instance.get(`/task/${cookies.editTask}`)
            setData({
                id: response.data.id,
                title: response.data.title,
                description: response.data.description,
                virtualMachine: [{
                    id: response.data.virtualMachine[0].id
                }],
                students: [{
                    id: response.data.students[0].id,
                    fullName: response.data.students[0].fullName
                }]
            })
        }
        catch(error) {
            console.log(error)
        }
    }

    const handleClick = async (e) => { //запрос на изменения задания
        e.preventDefault()
        const res = await instance.post('/task/modify', { 
            id : cookies.editTask,
            title : firstName,
            lastName : lastName,
        })
        window.location.reload()
    }

    function toggleInput() {
        setToggleTitle(false)
    }

    useEffect(() => {
        getTask()
    })

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
                                        className="userUpdateInput"
                                    />
                                )}
                            </div>
                            <div className="CKeditor">
                            <label>Описание задания</label>
                            <div className="editor-data">
                              <CKEditor editor={Editor} />
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