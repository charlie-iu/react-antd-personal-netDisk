import React from "react";
import {Button,message} from "antd";
import {CloudUploadOutlined, CloudDownloadOutlined, FileAddOutlined} from "@ant-design/icons";
import axios from "axios";
export default class CommonContentHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            basicInfo:{
                url:'',
                folderId:'',
            }
        }
    }

    handleUpload=(file)=>{
        const formData=new FormData();
        formData.append('file',file);
        axios.post('netdisk/upload.w', {

        }).then(obj =>{
            message.success('成功!')


        }).catch(err=>{
            message.error('失败!')
        })
    }
    handleDownLoad=(data)=>{

    }
    render()  {
        return (
            <React.Fragment>
                <Button className="antd-margin-right-08 antd-text-border-color-blue" icon={<CloudUploadOutlined/>} onClick={this.handleUpload.bind(this)}>上传</Button>
                <Button className="antd-margin-right-08 antd-text-border-color-blue" icon={<FileAddOutlined/>}>新建</Button>
                <Button className="antd-text-border-color-blue" icon={<CloudDownloadOutlined/>} onClick={this.handleDownLoad.bind(this)}>下载</Button>
            </React.Fragment>
        )
    }
}