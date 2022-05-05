import * as React from "react";
import AdminBar from "../../components/AdminBar";
import SideBarAdmin from "../../components/SideBarAdmin";

const NewUser = () => {
  return (
    <>
      <AdminBar />
      <div className="createUser">
        <SideBarAdmin />
        <div className="others">
          <div className="newUser">
            <h1 className="newUserTitle">Создание пользователя</h1>
            <form className="newUserForm">
              <div className="newUserItem">
                <label>Логин</label>
                <input type="text" placeholder="Логин" />
              </div>
              <div className="newUserItem">
                <label>Имя</label>
                <input type="text" placeholder="Имя" />
              </div>
              <div className="newUserItem">
                <label>Фамилия</label>
                <input type="text" placeholder="Фамилия" />
              </div>
              <div className="newUserItem">
                <label>Пароль</label>
                <input type="password" placeholder="Пароль" />
              </div>
              <div className="newUserItem">
                <label>Роль пользователя</label>
                <select className="newUserSelect" name="active" id="active">
                  <option value="yes">1</option>
                  <option value="no">0</option>
                </select>
              </div>
              <div className="test">
              <button className="newUserButton">Create</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewUser;
