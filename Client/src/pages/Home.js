import Nav from "../components/Nav";
import { useCookies } from "react-cookie";
import React, {useState, useEffect} from "react";
import axios from 'axios'
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 1 ,
  boxShadow: 24,
  p: 4,
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

  function handleChange (e) {
    if(check == true) {
      setIsDisabled(true)
      setAlert(false)
    }
    else {
      setIsDisabled(false)
      setAlert(true)
    }
    setCheck(e.target.checked)
  }

  function handleClickDelete (e) {
    setCheck(false)
    setIsDisabled(true)
  }


  const [alert, setAlert] = useState(true)
  function onClose () {
    setAlert(false)
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
   
  return (
    <>
        <div className="overlay">
        <div className="head-menu">
          {alert && <Alert
            iconMapping={{success: <CheckIcon fontSize="medium" />}}
            style={{fontSize: 18}}
            onClose={(e) => {onClose()}}>
            Подключение к виртуальной машине прошло успешно
            </Alert>}
          <Nav authToken={authToken}/>
        </div>
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
                        <Button className="connect-button" name="connectbtn" variant="outlined" disabled={isDisabled} onClick={handleOpen}>Подключиться</Button>
                        <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                              Данные для подключения к виртуальной машине: 
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                              <p>Адресс: https://task_number_1</p>
                              <p>Порт: 1234</p>
                              <p>Пароль: 12345</p>
                            </Typography>
                          </Box>
                        </Modal>
                        <Button variant="outlined" name="deletebtn" color="error" disabled={isDisabled} onClick={e => handleClickDelete(e)}>Удалить</Button>
                      </div>
                    </li>
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
