import * as SGT from "./siteGroupTypes";

const initialState = {
    siteGroup: "",
    error: "",
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SGT.SAVE_SITE_GROUP_REQUEST:
        case SGT.ADD_SITES_TO_GROUP_REQUEST:
        case SGT.FETCH_SITE_GROUP_REQUEST:
        case SGT.UPDATE_SITE_GROUP_REQUEST:
        case SGT.DELETE_SITE_GROUP_REQUEST:
        case SGT.DELETE_SITES_OF_GROUP_REQUEST:
            return {
                ...state,
            };
        case SGT.SITE_GROUP_SUCCESS:
            return {
                siteGroup: action.payload,
                error: "",
            };
        case SGT.SITE_GROUP_FAILURE:
            return {
                siteGroup: "",
                error: action.payload,
            };
        // case SGT.LANGUAGES_SUCCESS:
        //     return {
        //         languages: action.payload,
        //         error: "",
        //     };
        // case SGT.LANGUAGES_FAILURE:
        //     return {
        //         languages: "",
        //         error: action.payload,
        //     };
        default:
            return state;
    }
};

export default reducer;