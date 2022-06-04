import React from 'react'
import "../index.css"
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from 'react-router-dom'
import { useCookies } from "react-cookie";
import { useState } from 'react';
import { useEffect} from 'react';
import axios from 'axios';
import * as XLSX from "xlsx"

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

    const [data, setData] = useState()

    const importExcel = (e) => {
        const file = e.target.files[0]

        const reader = new FileReader()

        reader.onload = async (e) => {
            const bstr = e.target.result
            const workBook = XLSX.read(bstr, {type:"binary"})

            const workSheetName = workBook.SheetNames[0]
            const workSheet = workBook.Sheets[workSheetName]
            
            const fileData = XLSX.utils.sheet_to_json(workSheet, {header:1})
            const headers = fileData[0]

            fileData.splice(0,1)
            const newArray =  fileData.map ( fileData => { 
                const eachObject = headers.reduce((obj, header, i ) => {
                    obj[header] = fileData[i]
                    return obj
                }, {})
                return eachObject
            })

            for( let i = 0; i < newArray.length; i++) {
                newArray[i].firstName = newArray[i].firstName.toString()
                newArray[i].lastName = newArray[i].lastName.toString()
                newArray[i].password = newArray[i].password.toString()
                newArray[i].login = newArray[i].login.toString()
            }

            setData({'users' : newArray})
        }

        reader.readAsBinaryString(file)
    }

    const requestCsvFile = async () => {
        const response = await axios.post('/users/create', JSON.stringify(data),  {headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + cookies.AuthToken}})
        window.location.reload()
    }

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
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv"
                                        id="acsvFile"
                                        onChange={importExcel}
                                        />
                                    </li>
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