import { 
  ERROR_IN_SENDING_MESSAGE_TO_REDUX,
   MESSAGE_LOADING ,
   ADD_MESSAGE,
   ONCLICK_DATA_SAVE_TO_REDUX,
   SET_CHAT_MESSAGE,DELETE_MESSAGE_SUCCESS,
   MESSAGE_SUCCESS_SEND_TO_REDUX} from "./actiontype";


const initialState = {
    sender: null, 
    receiver: null, 
    messages: [], 
    isLoading: false, 
    isError: false, 
  };

  
  export const reducer = (state = initialState, { type, payload }) => {
    switch (type) {

      case SET_CHAT_MESSAGE:
        return {
          ...state,
          sender:payload[0]?.sender ?  payload[0].sender : [],
          receiver:payload[0]?.receiver ? payload[0].receiver : [],
          messages:payload ? payload : [],
        }
        
      case MESSAGE_LOADING:
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
  
      case MESSAGE_SUCCESS_SEND_TO_REDUX:
        return {
          ...state,
          isLoading: false,
          messages: [...state.messages,payload], 
          isError: false,
        };
  
      case ERROR_IN_SENDING_MESSAGE_TO_REDUX:
        return {
          ...state,
          isLoading: false,
          isError: true,
        };

      case DELETE_MESSAGE_SUCCESS:
        return {
          ...state,
          messages: state.messages.filter((msg) => msg.timestamp !== payload),
      };

        case ONCLICK_DATA_SAVE_TO_REDUX:
          return {
            ...state,
            receiver:payload,
          }
  
      case ADD_MESSAGE:
        return {
          ...state,
          messages: [...state.messages, payload], 
        };
  
      default:
        return state;
    }
  };
  