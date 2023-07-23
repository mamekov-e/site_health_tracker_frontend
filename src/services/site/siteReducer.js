import * as ST from "./siteTypes";

const initialState = {
    site: "",
    error: "",
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ST.SAVE_SITE_REQUEST:
        case ST.FETCH_SITE_REQUEST:
        case ST.UPDATE_SITE_REQUEST:
        case ST.DELETE_SITE_REQUEST:
            return {
                ...state,
            };
        case ST.SITE_SUCCESS:
            return {
                site: action.payload,
                error: "",
            };
        case ST.SITE_FAILURE:
            return {
                site: "",
                error: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;