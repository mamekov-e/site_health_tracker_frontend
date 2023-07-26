import * as ET from "./emailTypes";

const initialState = {
    email: "",
    error: "",
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ET.REGISTER_EMAIL_REQUEST:
        case ET.UNREGISTER_EMAIL_REQUEST:
            return {
                ...state,
            };
        case ET.EMAIL_SUCCESS:
            return {
                email: action.payload,
                error: "",
            };
        case ET.EMAIL_FAILURE:
            return {
                email: "",
                error: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;