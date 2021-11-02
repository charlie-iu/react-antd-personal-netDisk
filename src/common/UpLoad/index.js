import React from "react";
import {Button, message, Upload} from "antd";
import {CloudUploadOutlined} from "@ant-design/icons";

export default function UpLoad(props) {
    let {directory} = props;

    function uploadChange(info) {
        if (info.file.status === 'done') {
            message.success(`${info.file.name}上传成功!`);
            this.timer = setInterval(() => {
                window.location.reload();
            }, 2000)
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name}上传失败!`);
        }
    }

    return (
        <div style={{display: 'inline-block'}}>
            <Upload
                headers={{Authorization: window.sessionStorage.getItem('token')}}
                action="/netdisk/upload"
                className="upload-list-inline"
                multiple
                directory={directory}
                onChange={uploadChange}
                beforeUpload={props.beforeUpload}
            >
                <Button size='small'
                        className="antd-margin-right-08 antd-text-border-color-blue antd-margin-bottom-08"
                        icon={<CloudUploadOutlined/>}>上传</Button>
            </Upload>
        </div>
    )
}
