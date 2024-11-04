import * as AT from "./authTypes";

const initialState = {
    isAuthenticated: !!localStorage.getItem("user"),
    currentUser: localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")) : null,
    error: null,
    loading: false,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AT.REGISTER_REQUEST:
        case AT.LOGIN_REQUEST:
        case AT.FORGOT_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case AT.REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case AT.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                currentUser: action.payload,
                loading: false,
            };
        case AT.LOGOUT_USER:
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
            };
        case AT.FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case AT.REGISTER_FAILURE:
        case AT.LOGIN_FAILURE:
        case AT.FORGOT_PASSWORD_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;