import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { Form, Input, message } from 'antd';
import { nanoid } from 'nanoid';
import DP from '../images/dp.png';
import Send from '../images/twiterr.png';
const socket = io.connect('http://localhost:3000/');

const Home = () => {
  const backgroundImageStyle = {
    backgroundImage: `url('../images/chatbackground.png')`,
  };
  const inputRef = useRef(null);
  const [chat, setChat] = useState('');
  const [sendmessage, setSendmessage] = useState([]);
  const [receiveMessage, setReceiveMessage] = useState([]);
  const [room, setRoom] = useState();
  const [id, setId] = useState([]);
  const [naam, setName] = useState();
  const [contactCard, setContactCard] = useState(false);
  const[userName,setuserName]=useState([]);
  const callboth = async (name) => {
    await handleConnect(name);
    await handleConnect(name);
    setSendmessage([]);
    setReceiveMessage([]);
  };
  const sendChatMessage = () => {
    const currentTime = new Date();
  const timestamp = currentTime.getTime();
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  const amorpm = hour < 12 ? 'AM' : 'PM';
  const messageObject = { content: chat, sender: 'sent', timestamp, hour, minute, amorpm };
    socket.emit('send_message', {
      message: messageObject,
      room,
    });
    setSendmessage((prevMessages) => [...prevMessages, messageObject]);
    setChat('');
    inputRef.current.value = '';
  };

  const handleSave = async (value) => {
    const generatedId = nanoid(10);
    try {
      const res = await axios.post('http://localhost:3000/api/v1/user/ContactData', { ...value, generatedId }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        message.success(res.data.message);
        setContactCard(false);
      }
      if (!res.data.success) {
        message.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      message.error('Error in Contact Saving');
    }
  };

  const handleConnect = async (name) => {
    try {
      await setName(name);

      const res = await axios.get('http://localhost:3000/api/v1/user/connectusers', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });

      if (res.data.success) {
        setId(res.data.arr);

        const roomValue = res.data.arr.find((value) => value.contactuser === name)?.nanoid;
        const joinRoom = () => {
          if (roomValue !== '') {
            socket.emit('join_room', roomValue);
          }
        };

        if (roomValue) {
          setRoom(roomValue);
        }

        await joinRoom();
      }
    } catch (err) {
      console.log(err);
      message.error('Error in handleConnect');
    }
  };

  const [savedContacts, setSavedContacts] = useState([]);


  const getContacts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/v1/user/savedcontacts', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        setSavedContacts(res.data.User.contacts);
        setuserName(res.data.User.name);
      }
    } catch (err) {
      console.log(err);
      // message.error("Error in Contacts retreival");
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  const handleContact = () => {
    setContactCard(true);
  };

  const hide = () => {
    setContactCard(false);
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setReceiveMessage((prevMessages) => [...prevMessages, data.message]);
    });
    return () => {
      socket.off('receive_message');
    };
  }, []);

  return (
    <div>
      <div className='h-screen w-screen bg-gray-800 flex' style={{ fontFamily: 'Fira Sans, sans-serif' }}>
        <div className='h-screen overflow-y-auto flex flex-col gap-6 bg-slate-800 w-1/3'>
          <div className='h-14 w-full flex justify-end'>
          <div className='h-full  w-3/4 flex items-center text-2xl text-white'>
              <h1 className='pl-3'>{userName}</h1>
            </div>
            <button
              onClick={handleContact}
              className='text-white border border-white hover:border hover:border-green-300 hover:bg-green-300 hover:text-white transition ease-in-out duration-1000 m-2 w-32 rounded-3xl shadow-md shadow-black'
            >
              Add Contact
            </button>
          </div>
          <div className='h-full w-full  '>
            {contactCard && (
              <div className='w-full h-5/6'>
                <div className='w-full h-full flex items-center justify-center'>
                  <div className='w-3/4 h-1/2 bg-gray-400 shadow-2xl'>
                    <div className='h-10 w-full flex justify-end'>
                      <h1
                        className='text-3xl pr-2 hover  hover:cursor-pointer hover:text-white transition ease-in-out duration-1000'
                        onClick={hide}
                      >
                        x
                      </h1>
                    </div>
                    <div>
                      <Form onFinish={handleSave} className='flex flex-col items-center justify-center  h-full'>
                        <Form.Item label='Name' name='name' className='w-3/4'>
                          <Input type='text' />
                        </Form.Item>
                        <Form.Item label='Phone' name='mobile' className='w-3/4'>
                          <Input />
                        </Form.Item>
                        <button
                          type='submit'
                          className='w-3/4 text-white text-xl border border-white hover:border-blue-400 flex justify-center items-center
                 hover:bg-blue-400 transition ease-in-out duration-1000 rounded-full'
                        >
                          Save
                        </button>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            )}
{!contactCard && (
        <div className='w-full h-full flex flex-col gap-5 p-2'>
          {savedContacts.map((value, key) => (
            <Link to={`/chat/${value._id}`} key={key}>
              <div
                onClick={() => callboth(value.contactuser)}
                className='w-full h-12 flex rounded-md shadow-md shadow-black hover:cursor-pointer hover:bg-gray-700 transition ease-in-out duration-1000'
              >
                <div className='w-14 h-12 p-1'>
                  <img src={DP} alt='' />
                </div>
                <div className='w-full h-12 text-white text-xl flex justify-start ps-8 items-center'>
                  {value.contactuser}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
          </div>
        </div>
        <div className='h-screen w-2/3 bg-gray-800' style={backgroundImageStyle}>
        <div className='h-12 bg-gray-800 text-white text-2xl flex items-center ' >
          <img className='h-3/4 ps-5' src={DP} alt="" />
          <h1 className='ps-5'>{naam}</h1>
          </div>
          <div className='w-full h-4/5 flex flex-col-reverse overflow-y-auto '>
  <div className='flex flex-col pt-2' style={{ scrollbarWidth: 'thin', scrollbarColor: '#4A5568 #2D3748' }}>
    {[...receiveMessage, ...sendmessage].sort((a, b) => a.timestamp - b.timestamp).map((message, index) => (
      <div
        className={`h-10 flex w-full pl-1 mb-5 ${sendmessage.includes(message) ? 'justify-end' : 'justify-start'}`}
        key={index}
      >
        <p
          className={`h-full p-4 flex items-center rounded-sm text-white shadow-md mr-1 ${
            sendmessage.includes(message) ? 'bg-green-500 self-end' : 'bg-blue-500 self-start'
          }`}
        >
          {message.content}
          <p className='text-[12px]  relative top-2 left-3'>{message.hour}:{message.minute}{message.amorpm}</p>
        </p>
      </div>
    ))}
  </div>
</div>
          <div className='w-full h-12 flex items-center gap-1'>
            <input
              ref={inputRef}
              type='text'
              placeholder='message....'
              className='w-5/6 h-11 p-2 rounded-sm bg-black text-white shadow-xl ml-1'
              onChange={(e) => {
                setChat(e.target.value);
              }}
            />
            <button
              className='w-1/6 flex h-11 mr-1 text-2xl shadow-md shadow-black
              rounded-md bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-700 hover:to-green-700 hover:border-blue-700 transition ease-in-out duration-1000"'
              onClick={sendChatMessage}
            >
           <span className='h-full flex items-center w-3/4  justify-center'> <img className='h-3/4 ' src={Send} alt="" /> 
           </span><span className='flex items-center h-full mr-4 justify-center' style={{fontFamily:'Pacifico'}}>SEND</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
