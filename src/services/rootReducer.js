import { combineReducers } from "redux";
import siteReducer from "./site/siteReducer";
import siteGroupReducer from "./site_group/siteGroupReducer";

const rootReducer = combineReducers({
    site: siteReducer,
    siteGroup: siteGroupReducer,
});

export default rootReducer;