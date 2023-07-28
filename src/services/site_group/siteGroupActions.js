import * as SGT from "./siteGroupTypes";
import axios from "axios";
import {BASE_URL} from "../../utils/config";

export const saveSiteGroup = (siteGroup) => {
    return async (dispatch) => {
        dispatch({
            type: SGT.SAVE_SITE_GROUP_REQUEST,
        });
        try {
            const response = await axios.post(`${BASE_URL}/site-groups`, siteGroup)
            dispatch(siteGroupSuccess(response.data));
        } catch (error) {
            dispatch(siteGroupFailure(error));
        }
    };
};

export const addSitesToGroup = (siteGroupId, sites) => {
    return async (dispatch) => {
        dispatch({
            type: SGT.ADD_SITES_TO_GROUP_REQUEST,
        });
        try {
            const response = await axios.post(`${BASE_URL}/site-groups/${siteGroupId}/sites/add`, sites)
            dispatch(siteGroupSuccess(response));
        } catch (error) {
            dispatch(siteGroupFailure(error));
        }
    };
};

export const fetchSiteGroup = (siteGroupId) => {
    return async (dispatch) => {
        dispatch({
            type: SGT.FETCH_SITE_GROUP_REQUEST,
        });
        try {
            const response = await axios.get(`${BASE_URL}/site-groups/${siteGroupId}`)
            dispatch(siteGroupSuccess(response.data));
        } catch (error) {
            dispatch(siteGroupFailure(error));
        }
    };
};

export const updateSiteGroup = (siteGroup) => {
    return async (dispatch) => {
        dispatch({
            type: SGT.UPDATE_SITE_GROUP_REQUEST,
        });
        try {
            const response = await axios.put(`${BASE_URL}/site-groups`, siteGroup)
            dispatch(siteGroupSuccess(response.data));
        } catch (error) {
            dispatch(siteGroupFailure(error));
        }
    };
};

export const deleteSiteGroup = (siteGroupId) => {
    return async (dispatch) => {
        dispatch({
            type: SGT.DELETE_SITE_GROUP_REQUEST,
        });
        try {
            const response = await axios.delete(`${BASE_URL}/site-groups/${siteGroupId}`)
            dispatch(siteGroupSuccess(response));
        } catch (error) {
            dispatch(siteGroupFailure(error));
        }
    };
};


export const deleteSitesOfGroup = (siteGroupId, sites) => {
    return async (dispatch) => {
        dispatch({
            type: SGT.DELETE_SITES_OF_GROUP_REQUEST,
        });
        try {
            const response = await axios.post(`${BASE_URL}/site-groups/${siteGroupId}/sites/delete`, sites)
            dispatch(siteGroupSuccess(response));
        } catch (error) {
            dispatch(siteGroupFailure(error));
        }
    };
};

const siteGroupSuccess = (siteGroup) => {
    return {
        type: SGT.SITE_GROUP_SUCCESS,
        payload: siteGroup,
    };
};

const siteGroupFailure = (error) => {
    return {
        type: SGT.SITE_GROUP_FAILURE,
        payload: error.response,
    };
};