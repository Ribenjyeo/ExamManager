import Nav from "../components/Nav";
import { useCookies } from "react-cookie";
import React, {useState, useEffect} from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios'

const Home = () => {
  const [cookies, setCookies, removeCookies] = useCookies(["user"]);
  const authToken = cookies.AuthToken;

  const [tasks, setTasks] = useState([])
  const [url, setUrl] = useState([])
  const [role, setRole] = useState(0)
  let array = []
  const instance = axios.create({  //экземпляр запроса с использованием текущего токена
    timeout: 1000,
    headers: {'Authorization': 'Bearer '+ cookies.AuthToken}
  });

  const getTasksList = async () => { // получить данные о задании по ID пользователя
    try {
        const response = await instance.get(`/user/${cookies.UserId}/tasks`)
        setTasks(response.data.tasks) 
    } 
    catch(error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    getTasksList()
  }, [])
 
   
  return (
    <>
        <div className="overlay">
        <Nav authToken={authToken} />  
        <div className="reminder">
          Незабывайте при первом входе в аккаунт        
          <br />
          изменить данные пользователя.
        </div>
        <div className="home">
          <h1>Ваши задания для выполнения:</h1>
          <div className="tasks">
            <ul>
              {tasks?.map((item, i) =>
              <li className="tasksItem" key={i}>
              <h1></h1>
              <h2>{i+1 + ". " + item.title}</h2>
              <label>{item.description}</label> <br/>
              <div className="copy-text">
                <input type="text" className="text"  defaultValue={item.url}/>
                <button onClick={() => {navigator.clipboard.writeText(item.url)}}>
                  <ContentCopyIcon className="btn-icon"/>
                </button>
              </div>
              </li>)
              }
            </ul>
         </div> 
        </div> 
      </div>
    </>
  );
};

export default Home;
