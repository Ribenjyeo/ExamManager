import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import TaskIcon from '@mui/icons-material/Task';
import Home from './../pages/Home';
import { Link } from "react-router-dom";

let sideorder = null;

const SideBarAdmin = () => {
    return (
        <>
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Главные функции</h3>
                    <ul className="sidebarList">
                        <li className="sidebarListItem">
                            <HomeIcon className='sidebarIcon'/>
                            <Link to="/" style={{ textDecoration: 'none', color: "black" }}>Главная</Link>
                        </li>
                        <li className="sidebarListItem">
                            <PersonIcon className='sidebarIcon'/>
                            <Link to="/admin/users" style={{ textDecoration: 'none', color: "black" }}>Пользователи</Link>
                        </li>
                        <li className="sidebarListItem">
                            <GroupIcon className='sidebarIcon'/>
                            <Link to="/admin/groups" style={{ textDecoration: 'none', color: "black" }}>Группы</Link>
                        </li>
                        <li className="sidebarListItem">
                            <TaskIcon className='sidebarIcon'/>
                            <Link to="/admin/task" style={{ textDecoration: 'none', color: "black" }}>Задания</Link>
                        </li>
                    </ul> 
                </div>
            </div>
        </div>
        </>
    );
};

export default SideBarAdmin;