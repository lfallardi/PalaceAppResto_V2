// const initialState = {};

// const appReducers = (state = initialState, action) => {
//     return state;
// };
//export default appReducers;
//Se agrega redux ---
import { combineReducers } from "redux";
import loginReducer from "./src/actions";

const appReducers = combineReducers({loginReducer});

export default appReducers;
