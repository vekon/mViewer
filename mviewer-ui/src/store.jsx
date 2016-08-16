/*
This file defines the main Redux Store. It will be required by all "smart" components in the app,
in our case Home and Hero.
*/

import { Redux } from 'redux';
import	connectionIdReducer from "./reducers/connectionId.jsx";
import {thunk}	from 'redux-thunk'; // allows us to use asynchronous actions

var rootReducer = Redux.combineReducers({
   connectionId: connectionIdReducer,
});

module.exports = Redux.applyMiddleware(thunk)(Redux.createStore)(rootReducer,initialState());
