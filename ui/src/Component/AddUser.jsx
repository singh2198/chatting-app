import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Button, Text } from '@chakra-ui/react';
import { Select as ChakraReactSelect } from 'chakra-react-select';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const AddUserContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  border-bottom: 1px solid #eee;

`;

const WelcomeText = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
`;

const AddButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const AddIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const UserSelectContainer = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 300px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin: 1rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

function AddUser() {
  const [users, setUsers] = useState([]); 
  const [selectedUsers, setSelectedUsers] = useState([]); 
  const [flag, setFlag] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const singup_id = params.get('singup_id');
  const name = params.get('name');
  const email = params.get('email');
  const singupobject_id=params.get('_id');
  // const url = "http://localhost:3032"
  let  url = process.env.REACT_APP_BACKEND_URL 
  

  useEffect(() => {
    fetchUsers();
  }, []);


  
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${url}getsingupuser`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
      console.log("Fetched users:", data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSelectionChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions || []); 
    console.log("Selected Users:", selectedOptions);
  };

  const handleAddUsers = async (selectedUserIds) => {
    try {
      const response = await axios.post(`${url}addUserToMap`, {
        loginUserId: singup_id, 
        addUserId: selectedUserIds,
        singupobject_id: singupobject_id 
      });

      console.log("respones", response);
    } catch (error) {
      console.error('Error adding users:', error);
    }
  };
  
  const onClickImage = () => {
    fetchUsers();
    setFlag(true);
  };

  const onimage=()=>{
    console.log("happen")
  }

  return (
    <ChakraProvider>
      <AddUserContainer>
        <WelcomeText>Welcome, {name || 'User'}!</WelcomeText>
        <AddButton onClick={onClickImage}>
          <AddIcon src="/assets/plus.png" alt="Add Users" />
        </AddButton>
      </AddUserContainer>

      {flag && (
        <UserSelectContainer>
          <CloseButton onClick={() => setFlag(false)}>&times;</CloseButton>
          <h3>Add Users to Chat</h3>
          <Select 
            multiple 
            value={selectedUsers} 
            onChange={(e) => {
              const options = e.target.options;
              const selectedValues = [];
              for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                  selectedValues.push(options[i].value);
                }
              }
              handleSelectionChange(selectedValues);
            }}
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </Select>
          <SubmitButton onClick={() => handleAddUsers(selectedUsers)}>
            Add Selected Users
          </SubmitButton>
        </UserSelectContainer>
      )}
    </ChakraProvider>
  );
}

export default AddUser;
