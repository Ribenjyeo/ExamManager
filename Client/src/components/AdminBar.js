import React from 'react'
import "../index.css"
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from 'react-router-dom'
import { useCookies } from "react-cookie";
import { useState } from 'react';
import axios from 'axios'
import { useEffect } from 'react';
import UploadIcon from '@mui/icons-material/Upload';

const AdminBar = () => {
    const [cookies, setCookies, removeCookies] = useCookies(['user']);
    let navigate = useNavigate()
    const handleClick = () => {
        removeCookies("UserId", cookies.id);
        removeCookies("AuthToken", cookies.AuthToken);
        removeCookies("firstName", cookies.firstName);
        removeCookies("lastName", cookies.lastName);
        removeCookies("userRole", cookies.userRole);
        navigate('/auth')
        window.location.reload()
    }

    const [csvFile, setCsvFile] = useState()
    const [csvArray, setCsvArray] = useState([])

    const processCSV = (str, delim=";") => { //обработка текста и получение массива 
        const headers = str.slice(0, str.indexOf('\n')).split(delim)

        const rows = str.slice(str.indexOf('\n')+1, -1).split('\n')

        const newArray =  rows.map ( row => { 
            const values = row.split(delim)
            const eachObject = headers.reduce((obj, header, i ) => {
                obj[header] = values[i]
                return obj
            }, {})
            return eachObject
        })

        for( let i = 0; i < newArray.length; i++) { //менял роль на Int
            newArray[i].role = parseInt(newArray[i].role)
        }

        setCsvArray({'users' : newArray})
    }

    const handleFile = () => {
        const file = csvFile
        const reader = new FileReader()

        reader.onload = function(e) { //получение текста
            const text = e.target.result
            processCSV(text)
        }
        reader.readAsText(file)
    }

    const requestCsvFile = async () => {
        const response = await axios.post('/users/create', JSON.stringify(csvArray),  {headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + cookies.AuthToken}})

        window.location.reload()
    }

    useEffect(() => {
        if(acsvFile.files[0]) {
            handleFile()
        }
    })

    return (
        <>
        <div className='AdminBar'>
            <div className='AdminBarWrapper'>
                <div className='topLeft'>
                    <span className='logo'>Панель Администратора</span>
                </div>
                <div className='topRight'>    
                    <div className='AdminBarIconsContainer'>
                        
                        <ul>
                            <li><SettingsIcon className='adminbarIcons'/>
                                <ul className='dropdown'>
                                    <li><p className='import' onClick={(e) => {requestCsvFile()}}>Импортировать пользователей</p>
                                        <input className='CsvFile'
                                        type="file"
                                        accept=".csv"
                                        id="acsvFile"
                                        onChange={(e) => {setCsvFile(e.target.files[0])}}
                                        />
                                    </li>
                                    {/* <li>Экспортировать пользователей</li> */}
                                    {/* <li>Импортировать задание</li>
                                    <li>Экспортировать задание</li> */}
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className='AdminBarIconsContainer' onClick={handleClick}>
                        <LogoutIcon  className='adminbarIcons'/>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default AdminBar;