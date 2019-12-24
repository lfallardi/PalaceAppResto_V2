import React, { Fragment } from 'react';
import AppNavigation from './AppNavigation';
import configureStore from "./configureStore";
import { Provider } from 'react-redux';
import configureFirebase from './libs/configureFirebase';

const store = configureStore();

configureFirebase();

const App = () => {
    return(
        <Provider store={store}>
            <AppNavigation/>
        </Provider>
    )
};

export default App;
