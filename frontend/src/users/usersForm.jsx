import React, { useState } from 'react';
import axios from 'axios';

const UserForm = ({ onUserCreated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rank, setRank] = useState('');
  const [contributionScore, setContributionScore] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:4200/users/create', { username, email, password, rank, contributionScore })
      .then(response => {
        onUserCreated(response.data);
        setUsername('');
        setEmail('');
        setPassword('');
        setRank('');
        setContributionScore(0);
      })
      .catch(error => console.error('Error creating user:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      ></input>
      <input
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      ></input>
      <input
        placeholder="Rank"
        value={rank}
        onChange={(e) => setRank(e.target.value)}
        required
      ></input>
      <input
        placeholder="Contribution Score"
        value={contributionScore}
        onChange={(e) => setContributionScore(e.target.value)}
        required
      ></input>
      <button type="submit">Register</button>
    </form>
  );
};

export default UserForm;