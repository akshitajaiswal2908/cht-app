import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Users({ token, setSelectedUser }) {
const [users, setUsers] = useState([]);
const navigate = useNavigate();


useEffect(() => {
const fetchUsers = async () => {
const res = await axios.get('http://localhost:5000/api/users', {
headers: { Authorization: `Bearer ${token}` }
});
setUsers(res.data);
};
fetchUsers();
}, [token]);


const handleSelect = (user) => {
setSelectedUser(user);
navigate('/chat');
};


return (
<div>
<h2>Users</h2>
<ul>
{users.map(u => (
<li key={u._id} onClick={() => handleSelect(u)}>{u.username}</li>
))}
</ul>
</div>
);
}


export default Users;