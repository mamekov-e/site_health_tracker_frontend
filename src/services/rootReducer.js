import { combineReducers } from "redux";
import siteReducer from "./site/siteReducer";
import siteGroupReducer from "./site_group/siteGroupReducer";
import emailReducer from "./email/emailReducer";
import authReducer from "./auth/authReducer";

const rootReducer = combineReducers({
    site: siteReducer,
    siteGroup: siteGroupReducer,
    email: emailReducer,
    auth: authReducer
});

export default rootReducer;