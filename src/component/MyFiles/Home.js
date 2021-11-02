import React from "react";
import {Switch,Route} from "react-router-dom";
import MyFiles from "./MyFiles";
import NextFolder from "./NextFolder";

export default function MyFileHome(){

    return(
        <>
            <Switch>
                <Route exact path='/myfiles' component={MyFiles}/>
                <Route path='/myfiles/nextFolder/:id/:name' component={NextFolder}/>
            </Switch>
        </>
    )
}
