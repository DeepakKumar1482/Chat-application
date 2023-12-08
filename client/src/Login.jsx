import {Form,Input,message} from 'antd'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'
import './index.css'
const Login = () => {
  const navigate=useNavigate();
  const onfinishHandler = async(value) => {
    console.log(value);
    try{
    const res=await axios.post('http://localhost:3000/api/v1/user/login', value);
    if(res.data.success){
      localStorage.setItem("token",res.data.token);
    message.success("Login successfully")
    navigate('/');
    }
    else{
      message.error(res.data.message)
    }
    }catch(err){
      console.log(err);
      message.error("Something went wrong")
    }
  }
  return (
    <div className='h-screen w-screen flex justify-center items-center flex-col gap-5 bg-gray-300 flex-wrap'>
      <div>
        <h1 className='text-2xl'>Login</h1>
      </div>
      <div className='bg-gray-200 md:p-20 p-9 rounded-sm shadow-xl'>
        <Form  onFinish={onfinishHandler} >
            <Form.Item label="Name"  name="name" >
                <Input type='text' className=' md:ml-5 md:w-52' required/>
            </Form.Item>
            <Form.Item label="Password" type="password" name="password" >
                <Input.Password type='password' className='md:w-52' required/>
            </Form.Item>
            <button className="w-full h-8 bg-white hover:bg-green-300 hover:text-white rounded-3xl transition ease-in-out duration-700" >Login
            </button>
            <div className='w-full  flex  justify-center mt-3'>
            <Link to='/register'>Don't have an account?</Link>
            </div>
        </Form>
        </div>
    </div>
  )
}

export default Login