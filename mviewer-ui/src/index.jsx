import React from 'react';
import {render} from 'react-dom';
import { Router, Route, hashHistory, browserHistory } from 'react-router'
import LoginComponent from './components/login/LoginComponent.jsx';
import DashBoardComponent from './components/dashboard/DashBoardComponent.jsx';
import PageNotFoundComponent from './components/pagenotfound/PageNotFoundComponent.jsx';
import HomeComponent from './components/home/HomeComponent.jsx';

render((
    <Router history={hashHistory}>
       <Route path="/" component={LoginComponent}/>
       <Route path="/dashboard" component={DashBoardComponent} >
            <Route path="/dashboard/home" component={HomeComponent} />
            <Route path="/dashboard/databases" />
       </Route>
       <Route path="*" component = {PageNotFoundComponent}/>
    </Router>
), document.getElementById('app'));
