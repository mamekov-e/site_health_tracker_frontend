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

export const addSitesToGroup = (siteGroupId, sites) => {
    return (dispatch) => {
        dispatch({
            type: SGT.ADD_SITES_TO_GROUP_REQUEST,
        });
        axios
            .post("http://localhost:8080/api/v1/site-groups/" + siteGroupId + "/sites/add", sites)
            .then((response) => {
                console.log("dispatcher response", response)
                dispatch(siteGroupSuccess(response.data));
            })
            .catch((error) => {
                console.log("dispatcher err", error)
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

// export const fetchSiteGroupSitesById = (siteGroupId) => {
//     return (dispatch) => {
//         dispatch({
//             type: SGT.FETCH_SITE_GROUP_SITES_REQUEST,
//         });
//         axios
//             .get("http://localhost:8080/api/v1/site-groups/" + siteGroupId + "/sites")
//             .then((response) => {
//                 dispatch(siteGroupSuccess(response.data));
//             })
//             .catch((error) => {
//                 dispatch(siteGroupFailure(error));
//             });
//     };
// };

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


export const deleteSitesOfGroup = (siteGroupId, sites) => {
    return (dispatch) => {
        dispatch({
            type: SGT.DELETE_SITES_OF_GROUP_REQUEST,
        });
        axios
            .post("http://localhost:8080/api/v1/site-groups/" + siteGroupId + "/sites/delete", sites)
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
        payload: error.response,
    };
};