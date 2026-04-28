import { GET_USER_DETAILS } from "../actions/userAction";

const initialState = {
    details : []
}

const userReducer = (state = initialState,action) => {
    switch(action.type){
        case GET_USER_DETAILS:
            return {
                ...state,
                details : action.payload
            }

        default:
            return state
    }
}

export default userReducer