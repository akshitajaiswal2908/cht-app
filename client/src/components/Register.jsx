import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Register() {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const navigate = useNavigate();


const handleSubmit = async (e) => {
e.preventDefault();
try {
await axios.post('http://localhost:5000/api/auth/register', { username, password });
navigate('/login');
} catch (err) {
alert('Registration failed');
}
};


return (
<form onSubmit={handleSubmit}>
<h2>Register</h2>
<input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
<button type="submit">Register</button>
</form>
);
}


export default Register;