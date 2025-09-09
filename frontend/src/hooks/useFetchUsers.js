import { useState, useEffect } from 'react';
import axios from 'axios';

export default useFetchUsers = (users) => {
    const [userList, setUserList] = useState(users);

    useEffect(() => {
        axios.get('http://localhost:4200/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));

    }, []);
};