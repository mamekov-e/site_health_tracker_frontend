import * as ST from "./siteTypes";
import axios from "axios";

export const saveSite = (site) => {
    return (dispatch) => {
        dispatch({
            type: ST.SAVE_SITE_REQUEST,
        });
        axios
            .post("http://localhost:8080/api/v1/sites", site)
            .then((response) => {
                dispatch(siteSuccess(response.data));
            })
            .catch((error) => {
                dispatch(siteFailure(error));
            });
    };
};

export const fetchSite = (siteId) => {
    return (dispatch) => {
        dispatch({
            type: ST.FETCH_SITE_REQUEST,
        });
        axios
            .get("http://localhost:8080/api/v1/sites/" + siteId)
            .then((response) => {
                dispatch(siteSuccess(response.data));
            })
            .catch((error) => {
                dispatch(siteFailure(error));
            });
    };
};

export const updateSite = (site) => {
    return (dispatch) => {
        dispatch({
            type: ST.UPDATE_SITE_REQUEST,
        });
        axios
            .put("http://localhost:8080/api/v1/sites", site)
            .then((response) => {
                dispatch(siteSuccess(response.data));
            })
            .catch((error) => {
                dispatch(siteFailure(error));
            });
    };
};

export const deleteSite = (siteId) => {
    return (dispatch) => {
        dispatch({
            type: ST.DELETE_SITE_REQUEST,
        });
        axios
            .delete("http://localhost:8080/api/v1/sites/" + siteId)
            .then((response) => {
                dispatch(siteSuccess(response.data));
            })
            .catch((error) => {
                dispatch(siteFailure(error));
            });
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