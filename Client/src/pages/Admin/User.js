import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'
import { Link } from 'react-router-dom'



const User = () => {
    return (
        <>
        <AdminBar/>
            <div className="user">
                <SideBarAdmin/>
                <div className="userContainer">
                <div className="userTitleContainer">
                    <h2 className="userTitle">Изменения пользователя</h2>
                    <Link to="/admin/newUser">
                        <button className="userAddButton">Создать</button>
                    </Link>
                </div>
                <div className="userShow">
                    <div className="userShowTop">
                        <div className="userShowTopTitle">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/149/149071.png?auto=compress&cs=tinysrgb&dpr=2&w=500"
                                alt=""
                                className="userShowImg"
                            />
                            <span className="userShowUserName">Ничаев Илья</span>
                            <span className="userShowUserTitle">ИВБО-01-17</span>
                        </div>
                    </div>
                    <div className="userDetails">
                        <div className="userShowButton">
                            <span className="userShowTitle"><b>Детали пользователя</b></span>
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>Логин:</b> NichAev</span>
                            </div>
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>Имя:</b> Илья</span>
                            </div>
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>Фамилия:</b> Ничаев</span>
                            </div>
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>Группа:</b> ИВБО-01-17</span>
                            </div>
                            <div className="userShowInfo">
                                <span className="userShowInfoTitle"><b>Количество выполненных заданий:</b> 5</span>
                            </div>
                        </div>
                        <div className="userUpdate">
                            <span className="userUpdateTitle">Изменить</span>
                            <form  className="userUpdateForm">
                                <div className="userUpdateLeft">
                                    <div className="userUpdateItem">
                                        <label>Логин:</label>
                                        <input type="text" placeholder="NichAev" className="userUpdateInput"/>
                                    </div>
                                    <div className="userUpdateItem">
                                        <label>Имя:</label>
                                        <input type="text" placeholder="Илья" className="userUpdateInput"/>
                                    </div>
                                    <div className="userUpdateItem">
                                        <label>Фамилия:</label>
                                        <input type="text" placeholder="Ничаев" className="userUpdateInput"/>
                                    </div>
                                    <div className="userUpdateItem">
                                        <label>Группа:</label>
                                        <input type="text" placeholder="ИВБО-01-17" className="userUpdateInput"/>
                                    </div>
                                    <div className="userUpdateItem">
                                        <label>Количество выполненных заданий:</label>
                                        <input type="text" placeholder="5" className="userUpdateInput"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default User;