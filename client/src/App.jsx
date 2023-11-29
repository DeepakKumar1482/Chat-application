// import io  from 'socket.io-client';
// const socket=io.connect("http://localhost:3000/")
// console.log(socket)
// import { useEffect,useState } from 'react';
// function App() {
//   const [chat,setchat]=useState('');
//   const [receivemessage,setreceivemessage]=useState([]);
//   const sendmessage=()=>{
//     socket.emit("send_message",{
//       message:chat
//     })
//   }
//   useEffect(()=>{
//     socket.on("receive_message",(data)=>{
//       // alert(data.message);
//       setreceivemessage[data.message];
//     })
//   },[socket]);
//   return (
//     <div className='h-screen w-screen bg-gray-600 flex justify-center items-center flex-col gap-5'>
//      <input type="text" placeholder='message....' className='w-60 h-11 p-2 rounded-2xl' onChange={(e)=>{setchat(e.target.value)}} />
//      <button className='w-32 bg-green-400 h-10 rounded-3xl' onClick={sendmessage}>send</button>
//      <h1>Message:</h1>
//      {
//       receivemessage.map((data)=>{
//        <p>{data}</p> 
//       })
//       }
//     </div>
//   );
// }

// export default App;
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:3000/");

function App() {
  const [chat, setchat] = useState('');
  const [receivemessage, setreceivemessage] = useState([]);
  const joinroom=()=>{
    if(room!=""){
      socket.emit("join_room",room)
    }
  }
const [room,setroom]=useState('');
  const sendmessage = () => {
    socket.emit("send_message", {
      message: chat,
      room
    });
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      // Update state correctly using the setreceivemessage function
      setreceivemessage(prevMessages => [...prevMessages, data.message]);
    });

    // Clean up the socket event listener when the component unmounts
    return () => {
      socket.off("receive_message");
    }
  }, [socket]);

  return (
    <div className='h-screen w-screen bg-gray-600 flex justify-center items-center flex-col gap-5'>
      <input type="text" placeholder='room number' onChange={(e)=>setroom(e.target.value)} />
      <button onClick={joinroom}>join room</button>
      <input type="text" placeholder='message....' className='w-60 h-11 p-2 rounded-2xl' onChange={(e) => { setchat(e.target.value) }} />
      <button className='w-32 bg-green-400 h-10 rounded-3xl' onClick={sendmessage}>send</button>
      <h1>Message:</h1>
      {
        receivemessage.map((data, index) => (
          // Each child in a list should have a unique "key" prop
          <p key={index}>{data}</p>
        ))
      }
    </div>
  );
}

export default App;
