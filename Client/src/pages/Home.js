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

  const GetTaskList = async () => {
    const response = await fetch(`/user/${cookies.UserId}/tasks`, {method: "GET", headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer ' + cookies.AuthToken}})
    const json = await response.json()
    const stringi = JSON.stringify(json)
    const parse = JSON.parse(stringi)
    setTasks(parse.personalTasks[0].tasks)
  }
  console.log(tasks)
  useEffect(() => {
    GetTaskList()
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
              <label>
                <div dangerouslySetInnerHTML={{ __html: item.description}}/>
              </label>
              <br/>
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
