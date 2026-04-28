import axios from "axios"

export const GET_USER_DETAILS = "GET_USER_DETAILS"

export const getUserDetails = () => {

    return async(dispatch) => {
        const config = {
            headers : {
                Authorization : "Bearer " + localStorage.getItem("token")
            }
        }

        const response = await axios.get("http://localhost:8080/api/auth/userdetails",config)

        dispatch({
            type : GET_USER_DETAILS,
            payload : response.data
        })
    }
}