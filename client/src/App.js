import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Users from './components/UsersList';
import Chat from './components/Chat';


function App() {
const [token, setToken] = useState(localStorage.getItem('token'));
const [selectedUser, setSelectedUser] = useState(null);


if (!token) {
return (
<Router>
<Routes>
<Route path="/login" element={<Login setToken={setToken} />} />
<Route path="/register" element={<Register />} />
<Route path="*" element={<Navigate to="/login" />} />
</Routes>
</Router>
);
}


return (
<Router>
<Routes>
<Route path="/users" element={<Users token={token} setSelectedUser={setSelectedUser} />} />
<Route path="/chat" element={<Chat token={token} selectedUser={selectedUser} />} />
<Route path="*" element={<Navigate to="/users" />} />
</Routes>
</Router>
);
}


export default App;