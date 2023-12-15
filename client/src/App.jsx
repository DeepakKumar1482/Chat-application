import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import PublicRoutes from './publicRoutes';
import ProtectedRoutes from './protectedRoutes';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={
            <PublicRoutes>
              {<Login />}
            </PublicRoutes>
          } />
          <Route path='/register' element={
            <PublicRoutes>
              {<Register />}
            </PublicRoutes>
          } />
          <Route path='/chat/:userId' element={
            <ProtectedRoutes>
              {<Home />}
            </ProtectedRoutes>
          } />
          <Route path='/' element={
            <ProtectedRoutes>
              {<Home />}
            </ProtectedRoutes>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
