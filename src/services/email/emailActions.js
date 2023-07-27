import * as ET from "./emailTypes";
import axios from "axios";
import {BASE_URL} from "../../utils/config";

export const unregisterEmail = (email) => {
    return async (dispatch) => {
        dispatch({
            type: ET.UNREGISTER_EMAIL_REQUEST,
        });
        try {
            const response = await axios.post(`${BASE_URL}/emails/unregister`, null, {params: email})
            dispatch(emailSuccess(response.data));
        } catch (error) {
            dispatch(emailFailure(error));
        }
    };
};


export const registerEmail = (email) => {
    return async (dispatch) => {
        dispatch({
            type: ET.REGISTER_EMAIL_REQUEST,
        });
        try {
            const response = await axios.post(`${BASE_URL}/emails/register`, null, {params: email})
            dispatch(emailSuccess(response.data));
        } catch (error) {
            dispatch(emailFailure(error));
        }
    };
};

const emailSuccess = (email) => {
    return {
        type: ET.EMAIL_SUCCESS,
        payload: email,
    };
};

const emailFailure = (error) => {
    return {
        type: ET.EMAIL_FAILURE,
        payload: error.response,
    };
};