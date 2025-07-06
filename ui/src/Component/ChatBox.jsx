import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import AddUser from "./AddUser";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessageTodb,deleteMessage } from "../redux/message/action";
import { useLocation } from "react-router-dom";
import { MESSAGE_SUCCESS_SEND_TO_REDUX,DELETE_MESSAGE_SUCCESS } from "./../redux/message/actiontype";
import styled from "styled-components";

const ChatBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-left: 1px solid #ccc;
  width: 80%;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
`;

const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const MessageContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
  border-radius: 1rem;
  background-color: ${(props) => (props.isSender ? '#007bff' : '#e0e0e0')};
  color: ${(props) => (props.isSender ? 'white' : 'black')};
  align-self: ${(props) => (props.isSender ? 'flex-end' : 'flex-start')};
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-right: 20px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  color: ${props => props.isSender ? 'white' : '#666'};
  cursor: pointer;
  padding: 4px 8px;
  font-size: 1.2rem;
  opacity: 0.7;
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    color: #ff4444;
    transform: scale(1.1);
  }
`;

const InputContainer = styled.div`
  display: flex;
  padding: 1rem;
  border-top: 1px solid #ccc;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 0.5rem;
`;

const SendButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ChatBox = ({ selectedProfileId,selectedProfilename}) => {
    const [formData, setFormData] = useState("");
    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState("");
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const login_singupId = params.get("_id");
    const { messages } = useSelector((state) => state.reduxStore);

    const url="http://localhost:3032"

    useEffect(() => {
        const generateRoomId = (id1, id2) => {
            return [id1, id2].sort().join("_");
        };
        const uniqueRoomId = generateRoomId(login_singupId, selectedProfileId);
        setRoomId(uniqueRoomId);
        console.log("uniqueRoomID", uniqueRoomId);
        if (login_singupId && selectedProfileId) {
            dispatch(fetchMessages(login_singupId, selectedProfileId));
        }
        const newSocket = io(`${url}`);
        setSocket(newSocket);
    
        const handleReceiveMessage = (data) => {
            console.log("Received message from server:", data);
            dispatch({ type: MESSAGE_SUCCESS_SEND_TO_REDUX, payload: data });
        };
        const handleDeleteMessage = (data) => {
            console.log("Delete event received:", data);
            dispatch({ type: DELETE_MESSAGE_SUCCESS, payload: data.timestamp });
        };
        newSocket.emit("join room", uniqueRoomId);
        newSocket.on("receiveMessage", handleReceiveMessage);
        newSocket.on("messageDeleted", handleDeleteMessage);
        return () => {
            newSocket.off("receiveMessage", handleReceiveMessage); 
            newSocket.disconnect(); 
        };
    }, [login_singupId, selectedProfileId]);
    

    const handleSubmit = (event) => {
        event.preventDefault();
        if (formData.trim() && socket) {
            const messageData = {
                roomId: roomId,
                message: formData,
                sender: login_singupId,
                receiver: selectedProfileId,
                timestamp: new Date().toISOString(),
            };
            socket.emit("chat message", messageData);
            dispatch(sendMessageTodb(messageData));
            setFormData("");
        }
    };

    const handleChange = (event) => {
        setFormData(event.target.value);
    };
    const handleDeleteMessage = (timestamp) => {
        if (socket) {
            const deleteData = { timestamp, roomId };
            socket.emit("deleteMessageServer", deleteData); 
        }
        dispatch(deleteMessage(timestamp));  
    };

    const sortedMessages = [...messages]
        .filter(msg => 
            (msg.sender === login_singupId && msg.receiver === selectedProfileId) ||
            (msg.sender === selectedProfileId && msg.receiver === login_singupId)
        )
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));


    return (
        <ChatBoxContainer>
            <ChatHeader>
                <AddUser />
            </ChatHeader>
            <ChatContent>
                <MessageContainer style={{height:'52vh'}}>
                    {sortedMessages.map((msg, index) => (
                        <MessageBubble key={index} isSender={msg.sender === login_singupId}>
                            <MessageContent>
                                <strong>{msg.sender === login_singupId ? "You" : selectedProfilename}</strong>
                                <p>{msg.message}</p>
                                <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                                {msg.sender === login_singupId && (
                                    <DeleteButton 
                                        isSender={msg.sender === login_singupId}
                                        onClick={() => handleDeleteMessage(msg.timestamp)}
                                    >
                                        ×
                                    </DeleteButton>
                                )}
                            </MessageContent>
                        </MessageBubble>
                    ))}
                </MessageContainer>
                <InputContainer>
                    <Input
                        type="text"
                        value={formData}
                        onChange={handleChange}
                        placeholder="Enter your message"
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleSubmit(event);
                            }
                        }}
                    />
                    <SendButton onClick={handleSubmit}>Send</SendButton>
                </InputContainer>
            </ChatContent>
        </ChatBoxContainer>
    );
};

export default ChatBox;
