import Nav from "../components/Nav";
import { useCookies } from "react-cookie";
import React, {useState, useEffect} from "react";
import axios from 'axios'
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';


const style = {
  width: '100%',
  bgcolor: '#efefef',
};

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

  useEffect(() => {
    GetTaskList()
  }, [])

  const [check, setCheck] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  console.log("Checkbox", check)
  console.log("Button", isDisabled)

  function handleChange (e) {
    if(check == true) {
      setIsDisabled(true)
    }
    else {
      setIsDisabled(false)
    }
    setCheck(e.target.checked)
  }

  function handleClick (e) {
    setCheck(false)
    setIsDisabled(true)
  }
   
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
                <div className="titles-block">
                  <h2>{i+1 + ". " + item.title}</h2> 
                  <div className="task-block" dangerouslySetInnerHTML={{ __html: item.description}}/>
                </div> 
                <div className="vm-block">
                  <ul className="vm-list">
                    <li className="vm-item">
                      <h2 className="h2-vm-title">Список виртуальных машин:</h2>
                      <div className="connect">
                        <label className="vm-title">Виртуальная машина №8</label>
                        <FormControlLabel
                          value="end"
                          control={<Switch color="primary" />}
                          label="Включить"
                          checked={check}
                          onChange={(e) => {handleChange(e)}}
                        />
                      </div>
                      <div className="connect-delete">
                        <Button className="connect-button" name="connectbtn" variant="outlined" disabled={isDisabled}>Подключиться</Button>
                        <span> </span>
                        <Button variant="outlined" name="deletebtn" color="error" disabled={isDisabled} onClick={e => handleClick(e)}>Удалить</Button>
                      </div>
                    </li>
                    {/* <li className="vm-item">
                      <div className="connect">
                        <label className="vm-title">Виртуальная машина №8</label>
                        <FormControlLabel
                          value="end"
                          control={<Switch color="primary" />}
                          label="Включить"
                          labelPlacement="end"
                          margin="0"
                          id="2"
                          onChange={handleChange()}
                        />
                      </div>
                      <div className="connect-delete">
                        <Button className="connect-button" variant="outlined" disabled>Подключиться</Button>
                        <span> </span>
                        <Button variant="outlined" color="error" disabled>Удалить</Button>
                      </div>
                    </li>
                    <li className="vm-item">
                      <div className="connect">
                        <label className="vm-title">Виртуальная машина №8</label>
                        <FormControlLabel
                          value="end"
                          control={<Switch color="primary" />}
                          label="Включить"
                          labelPlacement="end"
                          margin="0"
                        />
                      </div>
                      <div className="connect-delete">
                        <Button className="connect-button" variant="outlined" disabled>Подключиться</Button>
                        <span> </span>
                        <Button variant="outlined" color="error" disabled>Удалить</Button>
                      </div>
                    </li> */}
                  </ul>
                </div>
              <br/>
              </li>
                )} 
            </ul>
         </div> 
        </div> 
      </div>
    </>
  );
};

export default Home;
