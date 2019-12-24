import { createStore, applyMiddleware } from 'redux';
import appReducer from './appReducers';
import thunk from "redux-thunk";

const configureStore = () => {
    const store = createStore(appReducer, applyMiddleware(thunk));
    return store;
}

export default configureStore;
