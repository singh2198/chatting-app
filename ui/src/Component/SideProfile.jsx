import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import ChatBox from "./ChatBox";
import { dataSavetoRedux,getMessageForSenderReceiver} from "../redux/message/action";
import { useDispatch} from "react-redux";
import styled from "styled-components";

const SideProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  background-color: #f0f0f0;
  border-right: 1px solid #ccc;
  height: 100%
  overflow-y: auto;
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }

  &.selected {
    background-color: #007bff;
    color: white;
  }
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const ProfileName = styled.p`
  font-weight: bold;
  margin: 0;
`;

const SideProfile = () => {
    const [profiles, setProfiles] = useState([]);
    const [selectedProfileId, setSelectedProfileId] = useState(null); 
    const [selectedProfilename, setSelectedProfilename] = useState([]);
    const dispatch = useDispatch();
    // Backend url
    // const url='http://localhost:3032';
    const url =process.env.BACKEDN_URL
    
    const location =useLocation();
    const params = new URLSearchParams(location.search);
    const singup_id = params.get('singup_id');
    const singupObject_id=params.get('_id')


    const fetchProfiles = async () => {
        try {
            const response = await axios.post(`${url}/getmappedusers`,{singup_id}); 
            console.log("response",response);
            if (response.data) {
                const data = await response.data
                setProfiles(data);
            } else {
                console.error("Failed to fetch profiles:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching profiles:", error);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []); 

    function getuserChat(data){
        console.log("Event",data);
        setSelectedProfileId(data._id);
        setSelectedProfilename(data.name);
        dispatch(dataSavetoRedux(data._id));
        dispatch(getMessageForSenderReceiver(singupObject_id,data._id));
        console.log("SelectedProfile",selectedProfilename);
      

    }

    const fetchMessages = async (userId, chatPartnerId) => {
        try {
          const response = await axios.get(`${url}/getmessage`, {
            params: { userId, chatPartnerId },
          });
          console.log("getMessageResponse", response.data);
        } catch (error) {
          console.error("Error in getting message from server:", error);
        }
      };
      

    return (
        <>
            <SideProfileContainer style={{width:'20%'}}>
                {profiles.map((profile, index) => (
                    <ProfileItem
                        key={index}
                        className={selectedProfileId === profile._id ? "selected" : ""}
                        onClick={() => getuserChat(profile)}
                    >
                        <ProfileImage src={profile.image || "/assets/user.png"} alt="User" />
                        <ProfileName>{profile.name}</ProfileName>
                    </ProfileItem>
                ))}
            </SideProfileContainer>
            <ChatBox selectedProfileId={selectedProfileId} selectedProfilename={selectedProfilename} />
        </>
    );
}

export default SideProfile;
