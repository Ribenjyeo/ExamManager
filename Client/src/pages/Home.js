import Nav from "../components/Nav";
import React, {useState, useEffect} from "react";
import TaskHome from '../components/TaskHome'
import axios from 'axios'


const Home = () => {

  const [tasks, setTasks] = useState(null)
  let descendingTask

  const handleClick = (e) => {
    e.preventDefault()
    window.location.assign('/auth')
  }

  const  TaskDataResponse = async () => { 
    const result = await axios.get('./user/{id}/tasks') //{id?}
    console.log(result.data)
    setTasks(result.data)
  }
  
  useEffect(() => {
    TaskDataResponse()
  }, [])

  if (tasks) { //Предпологаемая сортировка заданий по возрастанию, для отображение сначала не выполненных заданий
    descendingTask =  tasks.sort((a, b) => a.status > b.status ? 1 : -1)
  } 

  console.log(descendingTask)

  return (
    <>
    { descendingTask && (
      <div className="overlay">
      <Nav />
      <div className="reminder">
        Незабывайте при первом входе в аккаунт
        <br />
        изменить данные пользователя.
      </div>
      <div className="home">
       {descendingTask.map((descendingTask, index) => (
         <TaskHome
            key={index}
            task={descendingTask}
          />
       ))}
      </div>
    </div>
    )}
    </>
  );
};

export default Home;
