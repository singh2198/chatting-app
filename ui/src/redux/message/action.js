import axios from "axios";
import { 
  MESSAGE_SUCCESS_SEND_TO_REDUX, 
  MESSAGE_ERROR,MESSAGE_LOADING ,
  ONCLICK_DATA_SAVE_TO_REDUX,
  SET_CHAT_MESSAGE,
  ERROR_IN_GETTING_MESSAGE,
  SUCCESSFULLY_MESSAGE_GET,
  DELETE_MESSAGE_SUCCESS,
  ERROR_IN_SENDING_MESSAGE_TO_REDUX,
  UPDATE_PROFILE

} from "./actiontype";

// let url = 'http://localhost:3032';
let url = process.env.REACT_APP_BACKEND_URL || "https://localhost:3032/";




export const fetchMessages = (sender, receiver) => async (dispatch) => {

    try {
      const response = await axios.post(`${url}/messages`,{
        sender,
        receiver
      });
      dispatch({ type: MESSAGE_SUCCESS_SEND_TO_REDUX, payload: response.data });
    } catch (error) {
      dispatch({ type: MESSAGE_ERROR, payload: error.message });
    }
  };


  export const sendMessageTodb=(data)=>async(dispatch)=>{
    try{
      const response =await axios.post(`${url}/sendMessage`,{
       data
      });
      dispatch({type:MESSAGE_SUCCESS_SEND_TO_REDUX,payload:response.data})
    }
    catch(error){
      dispatch({type:ERROR_IN_SENDING_MESSAGE_TO_REDUX,payload:error.message});
    }
  }

  export const dataSavetoRedux=(payload)=>async(dispatch)=>{
    
    dispatch({type:ONCLICK_DATA_SAVE_TO_REDUX,payload:payload});
  }


  export const getMessageForSenderReceiver=(userId,chatPartnerId)=>async(dispatch)=>{
    try{
      
      const response =await axios.get(`${url}/getmessage`,{
        params: { userId, chatPartnerId },
      })
      if(response.data){
        console.log("actionResponse",response.data);
        dispatch({type:SET_CHAT_MESSAGE,payload:response.data});
        dispatch({type:SUCCESSFULLY_MESSAGE_GET});
      }
    }catch(error){
      dispatch({type:ERROR_IN_GETTING_MESSAGE});
    }
  }
  


export const deleteMessage = (timestamp) => async (dispatch) => {
  try {
      const response = await axios.put(`${url}/deletemessage`, {
        timestamp
      });
      if (response.data.deletedMessage) {
          dispatch({type:DELETE_MESSAGE_SUCCESS,payload:timestamp});
      } else {
          console.error("Failed to delete message.");
      }
  } catch (error) {
      console.error("Error deleting message:", error);
  }
};

export const updateProfile= (payload)=> async (dispatch)=>{
  
  try{
    const response =await axios.put(`${url}/updateProfile`, payload)

    if(response){
      dispatch({type:UPDATE_PROFILE,payload:response.data})
    }
  }
  catch(error){
    console.error("Failed to update profile", error);
  }
}



