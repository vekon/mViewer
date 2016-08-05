import React from 'react';
import {render} from 'react-dom';
import { Router, Route, hashHistory, browserHistory } from 'react-router'
import LoginComponent from './components/login/LoginComponent.jsx';
import DashBoardComponent from './components/dashboard/DashBoardComponent.jsx';
import PageNotFoundComponent from './components/pagenotfound/PageNotFoundComponent.jsx';
import './vendors/css/grid.css';



render((
    <Router history={hashHistory}>
       <Route path="/" component={LoginComponent}/>
       <Route path="/dashboard" component={DashBoardComponent}/> 
       <Route path="*" component = {PageNotFoundComponent}/>
    </Router>
), document.getElementById('app'));