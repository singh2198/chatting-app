import {
    legacy_createStore,
    combineReducers,
    applyMiddleware,
    compose,
  } from "redux";
  import {thunk }from "redux-thunk";
  import  {reducer } from "./message/reducer";

  
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  
  const rootReducer = combineReducers({
    reduxStore:reducer
  });
  
  export const store = legacy_createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(thunk))
  );