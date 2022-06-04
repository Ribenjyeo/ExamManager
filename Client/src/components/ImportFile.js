import * as XLSX from "xlsx"
import "../index.css"
import React from 'react'
import { useState } from 'react';
import { useCookies } from "react-cookie";
import axios from 'axios';
const ImportFile = () => {

    const [cookies, setCookies, removeCookies] = useCookies(['user']);

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
            <button class="MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButtonBase-root  css-1knaqv7-MuiButtonBase-root-MuiButton-root"
                tabindex="0"
                type="button"
                aria-label="Export"
                aria-haspopup="menu"
                aria-labelledby="mui-49"
                id="mui-48"
                onClick={(e) => {requestCsvFile()}}
            >
                <span class="MuiButton-startIcon MuiButton-iconSizeSmall css-y6rp3m-MuiButton-startIcon">
                    <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                        focusable="false"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        data-testid="SaveAltIcon"
                    >
                        <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"></path>
                    </svg>
                </span>
                IMPORT
                <span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span>
            </button>
            <input className='custom-file-input'
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv"
                id="acsvFile"
                onChange={importExcel}
            />


        </>
    )
}

export default ImportFile