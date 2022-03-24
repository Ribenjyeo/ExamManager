import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookies, removeCookies] = useCookies(["user"]);

  const authToken = cookies.authToken;

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* {authToken && <Route path='/' element={<Home/>}/>}
          {!authToken && <Route path='/auth' element={<Login/>}/>} */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
