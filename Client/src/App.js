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
import Rename from "./components/Rename"
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookies, removeCookies] = useCookies(['user']);
  console.log(cookies.userRole)
  return (
    <div>
      <BrowserRouter> 
        <Routes>
          <Route path='/auth' exact element={<Login/>}/>
          {cookies.AuthToken == undefined && <Route path='/' element={<Navigate replace to="/auth"/>}/>} 
          {cookies.AuthToken != undefined && <Route path='/' element={<Home/>}/>}
           <Route path='/rename' element={<Rename/>}/>      
          {cookies.userRole == 0 && <Route path='/admin' element={<Navigate replace to="/admin/users"/>}/>}
          {cookies.userRole == 0 && <Route path='/admin/users' element={<UserList/>}/>}
          {cookies.userRole == 0 &&<Route path='/admin/users/:userId' element={<User/>}/>}
          {cookies.userRole == 0 &&<Route path='/admin/newUser' element={<NewUser/>}/>}
          {cookies.userRole == 0 &&<Route path='/admin/newGroup' element={<NewGroup/>}/>}
          {cookies.userRole == 0 &&<Route path='/admin/newGroup/:userId/students' element={<NewGroup/>}/>}
          {cookies.userRole == 0 &&<Route path='/admin/:userId/newTask' element={<NewTask/>}/>}
          {cookies.userRole == 0 &&<Route path='/admin/groups' element={<GroupsList/>}/>}
          {cookies.userRole == 0 &&<Route path='/admin/groups/:groupId' element={<Group/>}/>}
          {cookies.userRole == 0 &&<Route path='/admin/tasks/:taskId' element={<Task/>}/>}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
