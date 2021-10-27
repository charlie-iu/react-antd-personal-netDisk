import React from "react";
import PictureList from './PictureList';
import {Upload, Button, message} from 'antd';
import {CloudUploadOutlined} from '@ant-design/icons';

export default function Picture() {
    function handleChange(f) {
        if (f.file.status === 'done') {
            message.success(`${f.file.name}上传成功!`);
            window.location.reload();
        } else if (f.file.status === 'error') {
            message.error(`${f.file.name}上传失败!`);
            window.location.reload();
        }

    }

    function handleBeforeUpload(file) {
        switch (file.type) {
            case'image/jpg':
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':
            case 'image/bmp':
                return true;
            default:
                message.error(`${file.name}不是图片格式，请检查后再上传!`);
                return Upload.LIST_IGNORE;
        }
    }

        return (
            <>
                <div style={{display: 'inline-block'}}>
                    <Upload
                        headers={{Authorization: window.sessionStorage.getItem('token')}}
                        action="http://localhost:3000/netdisk/upload"
                        listType="picture"
                        className="upload-list-inline"
                        multiple
                        onChange={handleChange}
                        beforeUpload={handleBeforeUpload}
                    >
                        <Button className="antd-margin-right-08 antd-text-border-color-blue antd-margin-bottom-08"
                                icon={<CloudUploadOutlined/>}>上传</Button>
                    </Upload>
                </div>
                <PictureList/>
            </>
        )
    }

