import React from 'react'
import "../index.css"
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';


const AdminBar = () => {
    return (
        <>
        <div className='AdminBar'>
            <div className='AdminBarWrapper'>
                <div className='topLeft'>
                    <span className='logo'>Панель Администратора</span>
                </div>
                <div className='topRight'>    
                    <div className='AdminBarIconsContainer'>
                        <SettingsIcon/>
                    </div>
                    <div className='AdminBarIconsContainer'>
                        <LogoutIcon/>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default AdminBar;