import React from 'react';
import {render} from 'react-dom';
import { createStore } from 'redux'
// import {store}  from './store.jsx';
import { Provider } from 'react-redux'
import { Router, Route, hashHistory, browserHistory } from 'react-router'
import LoginComponent from './components/login/LoginComponent.jsx';
import DashBoardComponent from './components/dashboard/DashBoardComponent.jsx';
import PageNotFoundComponent from './components/pagenotfound/PageNotFoundComponent.jsx';
import HomeComponent from './components/home/HomeComponent.jsx';
import DbStatsComponent from './components/dbstats/DbStatsComponent.jsx';
// import reducers from './reducers/reducers.jsx'

// let store = createStore(reducers)

render((
    <Router history={hashHistory}>
       <Route path="/" component={LoginComponent}/>
       <Route path="/dashboard" component={DashBoardComponent} >
            <Route path="/dashboard/home" component={HomeComponent} />
            <Route path="/dashboard/databases" component={DbStatsComponent} />
       </Route>
       <Route path="*" component = {PageNotFoundComponent}/>
    </Router>
), document.getElementById('app'));
