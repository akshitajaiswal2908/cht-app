import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Login({ setToken }) {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const navigate = useNavigate();


const handleSubmit = async (e) => {
e.preventDefault();
try {
const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
localStorage.setItem('token', res.data.token);
setToken(res.data.token);
navigate('/users');
} catch (err) {
alert('Login failed');
}
};


return (
<form onSubmit={handleSubmit}>
<h2>Login</h2>
<input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
<button type="submit">Login</button>
</form>
);
}


export default Login;