import { combineReducers } from "redux";
import siteReducer from "./site/siteReducer";
import siteGroupReducer from "./site_group/siteGroupReducer";
import emailReducer from "./email/emailReducer";

const rootReducer = combineReducers({
    site: siteReducer,
    siteGroup: siteGroupReducer,
    email: emailReducer
});

export default rootReducer;