import logo from "../img/MIREA_Gerb_Colour.png";
import { useCookies } from "react-cookie";

const Nav = () => {
  const [cookies, setCookies, removeCookies] = useCookies(["user"]);

  // let pathName = window.location.pathname;
  const authToken = false;
  const userName = "Нечаев Илья";
  const data_change = true;

  const logout = () => {
    removeCookies("UserId", cookies.UserId);
    removeCookies("AuthToken", cookies.authToken);
    window.location.assign('/auth');
  };

  return (
    <nav>
      <span className="logo-container">
        <img
          className="logo"
          src={logo}
          alt="учебный портал по системному администрированию РТУ МИРЭА"
        />
      </span>
      <span>Учебный портал РТУ МИРЭА</span>
      <div className="nav-items">
        <ul>
          <li>
            <a href="#">Главная</a>
          </li>
          <li>
            <a href="#">Настройки</a>
          </li>
          {data_change && (
            <li>
              <a href="#">Смена данных</a>
            </li>
          )}
        </ul>
      </div>
      <div className="account">
        <span>{userName}</span>
        <button className="nav-button" onClick={logout}>
          {authToken ? "Войти" : "Выйти"}
        </button>
      </div>
    </nav>
  );
};

export default Nav;
