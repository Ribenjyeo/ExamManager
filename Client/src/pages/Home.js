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
    console.log(parse)
    setTasks(parse.personalTasks[0].tasks)
  }

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
              {/* {tasks?.map((item, i) => */}
              {/* <li className="tasksItem" key={i}> */}
              <li className="tasksItem">
                <div className="titles-block">
                  {/* <h2>{i+1 + ". " + item.title}</h2>  */}
                  <h2>Название задания</h2> 
                  {/* <div className="task-block" dangerouslySetInnerHTML={{ __html: item.description}}/> */}
                  <div className="task-block">Являясь всего лишь частью общей картины, тщательные исследования конкурентов формируют
                  глобальную экономическую сеть и при этом — преданы социально-демократической анафеме. Однозначно, предприниматели
                  в сети интернет лишь добавляют фракционных разногласий и подвергнуты целой серии независимых исследований.
                  Современные технологии достигли такого уровня, что социально-экономическое развитие играет важную роль в
                  формировании экономической целесообразности принимаемых решений. Ясность нашей позиции очевидна: высокое
                  качество позиционных исследований способствует подготовке и реализации соответствующих условий активизации.
                  В рамках спецификации современных стандартов, реплицированные с зарубежных источников, современные исследования
                  будут преданы социально-демократической анафеме. Ясность нашей позиции очевидна: дальнейшее развитие различных
                  форм деятельности играет важную роль в формировании модели развития. Прежде всего, высокое качество позиционных
                  исследований играет определяющее значение для распределения внутренних резервов и ресурсов. В целом, конечно,
                  высокотехнологичная концепция общественного уклада позволяет оценить значение новых предложений.</div>
                </div>
                <div className="vm-block">
                  <ul className="vm-list">
                    <li className="vm-item">
                      <h2>Список виртуальных машин:</h2>
                      <div className="connect">
                        <label className="vm-title">Виртуальная машина №8</label>
                        <FormControlLabel
                          value="end"
                          control={<Switch color="primary" />}
                          label="Включить"
                          labelPlacement="end"
                          defaultChecked
                        />
                      </div>
                      <div className="connect-delete">
                        <Button className="connect-button" variant="outlined">Подключиться</Button>
                        <span> </span>
                        <Button variant="outlined" color="error">Удалить</Button>
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
                    </li>
                  </ul>
                </div>
              <br/>
              </li>
              {/* )} */}
            </ul>
         </div> 
        </div> 
      </div>
    </>
  );
};

export default Home;
