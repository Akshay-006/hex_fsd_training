import { applyMiddleware, combineReducers, createStore } from "redux";
import userReducer from "./redux/reducers/userReducer";
import { thunk } from "redux-thunk";

const reducers = combineReducers({
    userReducer : userReducer
})

export const store = createStore(reducers,applyMiddleware(thunk))