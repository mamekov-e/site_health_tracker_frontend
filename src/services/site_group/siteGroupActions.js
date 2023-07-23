import * as SGT from "./siteGroupTypes";
import axios from "axios";

export const saveSiteGroup = (siteGroup) => {
    return (dispatch) => {
        dispatch({
            type: SGT.SAVE_SITE_GROUP_REQUEST,
        });
        axios
            .post("http://localhost:8080/api/v1/site-groups", siteGroup)
            .then((response) => {
                dispatch(siteGroupSuccess(response.data));
            })
            .catch((error) => {
                dispatch(siteGroupFailure(error));
            });
    };
};

export const fetchSiteGroup = (siteGroupId) => {
    return (dispatch) => {
        dispatch({
            type: SGT.FETCH_SITE_GROUP_REQUEST,
        });
        axios
            .get("http://localhost:8080/api/v1/site-groups/" + siteGroupId)
            .then((response) => {
                dispatch(siteGroupSuccess(response.data));
            })
            .catch((error) => {
                dispatch(siteGroupFailure(error));
            });
    };
};

export const updateSiteGroup = (siteGroup) => {
    return (dispatch) => {
        dispatch({
            type: SGT.UPDATE_SITE_GROUP_REQUEST,
        });
        axios
            .put("http://localhost:8080/api/v1/site-groups", siteGroup)
            .then((response) => {
                dispatch(siteGroupSuccess(response.data));
            })
            .catch((error) => {
                dispatch(siteGroupFailure(error));
            });
    };
};

export const deleteSiteGroup = (siteGroupId) => {
    return (dispatch) => {
        dispatch({
            type: SGT.DELETE_SITE_GROUP_REQUEST,
        });
        axios
            .delete("http://localhost:8080/api/v1/site-groups/" + siteGroupId)
            .then((response) => {
                dispatch(siteGroupSuccess(response.data));
            })
            .catch((error) => {
                dispatch(siteGroupFailure(error));
            });
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
        payload: error,
    };
};