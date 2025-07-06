import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const AuthFormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  background-color: #f9f9f9;
  background-image: url('https://source.unsplash.com/random/800x600/?chat');
  background-size: cover;
  background-position: center;
  top: 8em;
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  font-size: 1.8em;
  margin-bottom: 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 1rem;
  font-weight: bold;
  color: ${(props) => (props.active ? '#007bff' : '#333')};
  border-bottom: ${(props) => (props.active ? '2px solid #007bff' : 'none')};
  cursor: pointer;

  &:hover {
    color: #0056b3;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-top: 1rem;
  color: #555;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.8rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  margin-top: 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
`;

const InputContainer = styled.div`
  width: 100%;
`;

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // let  url ="http://localhost:3032"
  const url = process.env.REACT_APP_BACKEND_URL || "http://localhost:3032"

  const handleAuth = async (e) => {
    e.preventDefault();
  
    
    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill out all required fields.");
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      alert("Password and Confirm Password must be the same.");
      return;
    }
  
     url = isLogin ? `${url}/login` : `${url}/singup`;
    const data = isLogin ? { email, password } : { name, email, password };
  
    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("response",response);
      if (response.data.message) {
      const { singup_id, name, email ,_id} = response.data;
      window.location.href = `/chat?singup_id=${encodeURIComponent(singup_id)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&_id=${encodeURIComponent(_id)}`;

      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Error during ${isLogin ? 'login' : 'registration'}`;
      alert(errorMessage);
    }
  };
  

  return (
    <AuthFormContainer>
      <TabContainer>
        <Tab active={isLogin} onClick={() => setIsLogin(true)}>
          Login
        </Tab>
        <Tab active={!isLogin} onClick={() => setIsLogin(false)}>
          Sign Up
        </Tab>
      </TabContainer>

      <Title>{isLogin ? 'Login' : 'Sign Up'}</Title>
      <Form onSubmit={handleAuth}>
        {!isLogin && (
          <InputContainer>
            <Label>Name:</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputContainer>
        )}
        <InputContainer>
          <Label>Email:</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputContainer>
        <InputContainer>
          <Label>Password:</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputContainer>
        {!isLogin && (
          <InputContainer>
            <Label>Confirm Password:</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputContainer>
        )}
        <ButtonContainer>
          <Button type="submit" style={{width:'100%'}}>{isLogin ? 'Login' : 'Sign Up'}</Button>
        </ButtonContainer>
      </Form>
    </AuthFormContainer>
  );
}

export default AuthForm;
