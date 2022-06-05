import React from 'react'
import "../index.css"
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from 'react-router-dom'
import { useCookies } from "react-cookie";

const AdminBar = () => {
    const [cookies, setCookies, removeCookies] = useCookies(['user']);
    let navigate = useNavigate()

    const handleClick = () => {
        removeCookies("UserId", {path:'/'});
        removeCookies("AuthToken",  {path:'/'});
        removeCookies("firstName",  {path:'/'})
        removeCookies("lastName",  {path:'/'})
        removeCookies("userRole",  {path:'/'})
        removeCookies("editGroup", cookies.editGroup)
        removeCookies("editTask", cookies.editTask)
        removeCookies("editUser", cookies.editUser)
        navigate('/auth')
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