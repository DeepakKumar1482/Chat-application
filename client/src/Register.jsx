import React from 'react'
import {Form,Input,message}from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const Navigate=useNavigate();
  const handleRegister=async(values)=>{
    console.log(values);
    try{
      const res=await axios.post('http://localhost:3000/api/v1/user/register',values);
    if(res.data.success){
      message.success(res.data.message);
      Navigate('/login');
    }else{
      message.error(res.data.message);
    }
    }catch(err){
      console.log(err);
      message.error("Error");
    }
  }
  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center bg-gray-300 gap-5 flex-wrap'>
        <div className='flex'>
      <h1 className='text-2xl'>Register</h1>
      </div>
      <div className='bg-gray-200 md:p-20 p-9 flex flex-wrap rounded-sm shadow-xl'>
      <Form onFinish={handleRegister}>
        <Form.Item label="Name" name="name">
        <Input className=' md:ml-5 md:w-52' type='text' />
        </Form.Item>
        <Form.Item label="Password" name="password">
        <Input.Password type='password'  className='md:w-52'/>
        </Form.Item>
        <button type='submit' className='w-full bg-white hover:bg-green-300 hover:text-white transition ease-in-out duration-700 h-8 rounded-3xl'>Register</button>
      </Form>
      </div>
    </div>
  )
}

export default Register