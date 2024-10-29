import * as AT from "./authTypes";
import axios from "axios";
import {BASE_URL} from "../../utils/config";

export const registerUser = (userData) => {
    return async (dispatch) => {
        dispatch({type: AT.REGISTER_REQUEST});
        try {
            const response = await axios.post(`${BASE_URL}/public/signup`, userData);
            dispatch({type: AT.REGISTER_SUCCESS, payload: response.data});
            return response.data;
        } catch (error) {
            dispatch({type: AT.REGISTER_FAILURE, payload: error.response.data});
            throw error;
        }
    };
};

export const loginUser = (credentials) => {
    return async (dispatch) => {
        dispatch({type: AT.LOGIN_REQUEST});
        try {
            const response = await axios.post(`${BASE_URL}/public/signin`, credentials);
            dispatch({type: AT.LOGIN_SUCCESS, payload: response.data});
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            dispatch({type: AT.LOGIN_FAILURE, payload: error.response.data});
            throw error;
        }
    };
};

export const forgotPassword = (email) => {
    return async (dispatch) => {
        dispatch({type: AT.FORGOT_PASSWORD_REQUEST});
        try {
            const response = await axios.put(`${BASE_URL}/public/forgot-password`, {email});
            dispatch({type: AT.FORGOT_PASSWORD_SUCCESS});
            return response.data;
        } catch (error) {
            dispatch({type: AT.FORGOT_PASSWORD_FAILURE, payload: error.response.data});
            throw error;
        }
    };
};

export const setAuthenticated = (isAuthenticated) => {
    return {
        type: AT.SET_AUTHENTICATED,
        payload: isAuthenticated,
    };
};

export const logoutUser = () => {
    return (dispatch) => {
        localStorage.removeItem('user');

        dispatch({
            type: AT.LOGOUT_USER,
        });
    };
};
