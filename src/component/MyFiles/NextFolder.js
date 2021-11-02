import React from "react";
import MyFiles from "./MyFiles";
import SelectFileOrFolder from "../../common/SelectFileOrFolder/SelectFileOrFolder";
import NewFolder from "../../common/NewFolder";

export default function NextFolder(props) {

    function previous() {
        props.history.go(-1);
    }
  function initEntry(){

  }
    return (
        <>
            <SelectFileOrFolder/>
            <NewFolder initEntry={initEntry}/>
           <div>
               <a href="javascript:void 0;" onClick={previous}>返回上一级</a>
           </div>

        </>
    )
}
