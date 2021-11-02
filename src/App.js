import React from "react";
import {ConfigProvider} from 'antd';
import NavBar from "./pages/NavBar";
import zhCN from "antd/es/locale/zh_CN";
export default class App extends React.Component{

  render() {
    return(
        <div>
            <ConfigProvider locale={zhCN}>
            <NavBar />
            </ConfigProvider>
        </div>
    )
  }
}
