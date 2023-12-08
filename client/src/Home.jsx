import React,{useState,useEffect} from 'react'
import io from 'socket.io-client';
const socket = io.connect("http://localhost:3000/");
import axios from 'axios';
import {Form,Input,message,Button}from 'antd'
import {nanoid}from 'nanoid';
import DP from '../images/dp.png';
const Home = () => {
    const [chat, setchat] = useState('');
  const [receivemessage, setreceivemessage] = useState([]);
  const [room,setroom]=useState('');
  const[contactcard,setcontactcard] = useState(false);
  const joinroom=()=>{
    if(room!=""){
      socket.emit("join_room",room)
    }
  }
  const sendmessage = () => {
    socket.emit("send_message", {
      message: chat,
      room
    });
  }
  const handleSave=async(value)=>{
    const generatedId = nanoid(10);
    console.log(value);
    try{
      const res = await axios.post('http://localhost:3000/api/v1/user/ContactData',{...value,generatedId},{
        headers:{
          Authorization: 'Bearer ' +localStorage.getItem('token'),
        }
      });
      if(res.data.success){
        message.success(res.data.message);
        setcontactcard(false);
      }
      if(!res.data.success){
        message.error(res.data.message);
      }
    }catch(err){
      console.log(err);
      message.error("Error in Contact Saving");
    }
  }
  const [savedcontacts,setsavedcontacts] = useState([]);
  const getContacts=async()=>{
    try{
      const res=await axios.get('http://localhost:3000/api/v1/user/savedcontacts',{
      headers:{
        Authorization: 'Bearer ' +localStorage.getItem('token')
      }
    })
    if(res.data.success){
       setsavedcontacts(res.data.arr)
    }
    }catch(err){
      console.log(err);
      // message.error("Error in Contacts retreival");
    }
  }
  useEffect(()=>{
    getContacts();
  },[]);
  const handlecontact=()=>{
    setcontactcard(true);
  }
  const hide=()=>{
    setcontactcard(false);
  }
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setreceivemessage(prevMessages => [...prevMessages, data.message]);
    });
    return () => {
      socket.off("receive_message");
    }
  }, [socket]);
  return (
    <div>
    <div className='h-screen w-screen bg-gray-800 flex'>
      <div className='h-screen  overflow-y-auto flex flex-col bg-slate-800 w-1/3'>
        <div className='h-12 w-full  flex justify-end '>
          <button onClick={handlecontact} className='text-white border border-white hover:border hover:border-green-300 hover:bg-green-300 hover:text-black transition
           ease-in-out duration-1000 m-2 w-32 rounded-3xl'>Add Contact</button>
        </div>
        <div className='h-full w-full '>
        {contactcard &&(
        <div className='w-full h-5/6'>
          <div className='w-full h-full   flex items-center justify-center'>
            <div className='w-3/4 h-1/2 bg-gray-400 shadow-2xl'>
            <div className='h-10 w-full  flex justify-end'>
            <h1 className='text-3xl pr-2 hover  hover:cursor-pointer hover:text-white transition ease-in-out duration-1000' onClick={hide}>x</h1>
            </div>
            <div>
              <Form onFinish={handleSave} className='flex flex-col items-center justify-center  h-full'>
                <Form.Item label="Name" name="name" className='w-3/4'>
                  <Input type='text'/>
                </Form.Item>
                <Form.Item label="Phone" name="mobile" className='w-3/4'>
                  <Input/>
                </Form.Item>
                <button type='submit' className='w-3/4 text-white text-xl border border-white hover:border-blue-400 flex justify-center items-center
                 hover:bg-blue-400 transition ease-in-out duration-1000 rounded-full'>Save</button>
              </Form>
              </div>
            </div>
          </div>
        </div>
        )}
        {!contactcard &&(
         <div className='w-full h-full flex flex-col gap-5  '>
          {savedcontacts.map((value,key) => (  
            <div key={key} className='w-full h-12 flex rounded-md shadow-md shadow-black hover:cursor-pointer hover:bg-gray-700 transition ease-in-out duration-1000'>
            <div className='w-14 h-12 p-1'><img src={DP} alt="" /></div>
            <div className='w-full h-12 text-white text-xl flex justify-start ps-8 items-center'>{value.contactuser}</div>
            </div>
          ))}
         </div>
        )}
        </div>
       
      </div>
      <div className='h-screen w-2/3 overflow-auto bg-gray-600'>
        <input type="text" placeholder='room number' onChange={(e)=>setroom(e.target.value)} />
      <button onClick={joinroom}>join room</button>
      <input type="text" placeholder='message....' className='w-60 h-11 p-2 rounded-2xl' onChange={(e) => { setchat(e.target.value) }} />
      <button className='w-32 bg-green-400 h-10 rounded-3xl' onClick={sendmessage}>send</button>
      {
        receivemessage.map((data, index) => (
          <p key={index}>{data}</p>
        ))
      }
      </div>
    </div>
    </div>
  )
}

export default Home