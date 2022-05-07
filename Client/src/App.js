import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserList from "./pages/Admin/UserList"
import User from "./pages/Admin/User"
import GroupsList from "./pages/Admin/GroupsList";
import Group from "./pages/Admin/Group";
import NewUser from "./pages/Admin/NewUser";
import NewGroup from "./pages/Admin/NewGroup";
import NewTask from "./pages/Admin/NewTask"
import Task from "./pages/Admin/Task"

const App = () => {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' exact element={<Login/>}/>
          <Route path='/' element={<Home/>}/>        
          <Route path='/admin' element={<Navigate replace to="/admin/users"/>}/>
          <Route path='/admin/users' element={<UserList/>}/>
          <Route path='/admin/users/:userId' element={<User/>}/>
          <Route path='/admin/newUser' element={<NewUser/>}/>
          <Route path='/admin/newGroup' element={<NewGroup/>}/>
          <Route path='/admin/newGroup/:userId/students' element={<NewGroup/>}/>
          <Route path='/admin/:userId/newTask' element={<NewTask/>}/>
          <Route path='/admin/groups' element={<GroupsList/>}/>
          <Route path='/admin/groups/:groupId' element={<Group/>}/>
          <Route path='/admin/tasks/:taskId' element={<Task/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
