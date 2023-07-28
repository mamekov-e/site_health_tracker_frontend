import * as ST from "./siteTypes";
import axios from "axios";
import {BASE_URL} from "../../utils/config";

export const saveSite = (site) => {
    return async (dispatch) => {
        dispatch({
            type: ST.SAVE_SITE_REQUEST,
        });
        try {
            const response = await axios.post(`${BASE_URL}/sites`, site)
            dispatch(siteSuccess(response.data));
        } catch (error) {
            dispatch(siteFailure(error));
        }
    };
};

export const fetchSite = (siteId) => {
    return async (dispatch) => {
        dispatch({
            type: ST.FETCH_SITE_REQUEST,
        });
        try {
            const response = await axios.get(`${BASE_URL}/sites/${siteId}`)
            dispatch(siteSuccess(response.data));
        } catch (error) {
            dispatch(siteFailure(error));
        }
    };
};

export const updateSite = (site) => {
    return async (dispatch) => {
        dispatch({
            type: ST.UPDATE_SITE_REQUEST,
        });
        try {
            const response = await axios.put(`${BASE_URL}/sites`, site)
            dispatch(siteSuccess(response.data));
        } catch (error) {
            dispatch(siteFailure(error));
        }
    };
};

export const deleteSite = (siteId) => {
    return async (dispatch) => {
        dispatch({
            type: ST.DELETE_SITE_REQUEST,
        });
        try {
            const response = await axios.delete(`${BASE_URL}/sites/${siteId}`)
            dispatch(siteSuccess(response));
        } catch (error) {
            dispatch(siteFailure(error));
        }
    };
};

const siteSuccess = (site) => {
    return {
        type: ST.SITE_SUCCESS,
        payload: site,
    };
};

const siteFailure = (error) => {
    return {
        type: ST.SITE_FAILURE,
        payload: error.response,
    };
};