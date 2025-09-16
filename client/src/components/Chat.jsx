import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';


let socket;


function Chat({ token, selectedUser }) {
const [messages, setMessages] = useState([]);
const [input, setInput] = useState('');


useEffect(() => {
socket = io('http://localhost:5000', {
auth: { token }
});


socket.on('connect', () => {
console.log('Connected to socket');
});


socket.on('private_message', ({ from, content }) => {
setMessages(prev => [...prev, { from, content }]);
});


return () => {
socket.disconnect();
};
}, [token]);


const sendMessage = () => {
if (input && selectedUser) {
socket.emit('private_message', { to: selectedUser._id, content: input });
setMessages(prev => [...prev, { from: 'me', content: input }]);
setInput('');
}
};


return (
<div>
<h2>Chat with {selectedUser?.username}</h2>
<div>
{messages.map((m, i) => (
<p key={i}><b>{m.from}:</b> {m.content}</p>
))}
</div>
<input value={input} onChange={(e) => setInput(e.target.value)} />
<button onClick={sendMessage}>Send</button>
</div>
);
}


export default Chat;