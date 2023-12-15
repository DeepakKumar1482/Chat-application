// // ProtectedRoutes.js
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Navigate } from 'react-router-dom';
// import Home from './Home';
// // import Login from './Login';

// const ProtectedRoutes = ({ children }) => {
//     const [isLoggedIn, setIsLoggedIn] = useState(null);

//     const handleProtection = async () => {
//         try {
//             const res = await axios.get('http://localhost:3000/api/v1/user/getUser', {
//                 headers: {
//                     Authorization: 'Bearer ' + localStorage.getItem('token'),
//                 },
//             });

//             if (res.data.success) {
//                 setIsLoggedIn(true);
//             } else {
//                 setIsLoggedIn(false);
//             }
//         } catch (e) {
//             console.log(e);
//             setIsLoggedIn(false);
//         }
//     };

//     useEffect(() => {
//         handleProtection();
//     }, []);

//     if (isLoggedIn === null) {
//         // Loading state or you can show a loading spinner
//         return null;
//     }

//     return isLoggedIn!=null ? <Home /> : <Navigate to={'/login'} />;
// };

// export default ProtectedRoutes;



import React,{useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import  axios from 'axios';
const ProtectedRoutes = ({children}) => {
  const getUser=async()=>{
    try{
      const res = await axios.get('http://localhost:3000/api/v1/user/getUser', {
        token:localStorage.getItem('token')},
        {
          headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      }
      )
      if(res.data.success){
       setUser(res.data.data)
      }else{
        <Navigate to="/login"/>
        localStorage.clear()
      }
    }catch(err){
      localStorage.clear();
      console.log("This is from ProtectRoutes",err)
    }
  };
    if(localStorage.getItem("token")){
        return children;
    }
    else{
      return  <Navigate to={'/login'}/> 
    }
}
export default ProtectedRoutes;