import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import App from './App';
import 'antd/dist/antd.css';
import "../src/css/index.css";
import "../src/css/normalize.css";
import Login from "../src/Login";
import Register from "./Register";

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/register' component={Register}/>
                <Route path='/' component={App}/>
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
