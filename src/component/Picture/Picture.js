import React from "react";
import PictureList from './PictureList';
import {Upload, message} from 'antd';
import UpLoad from "../../common/UpLoad";

export default function Picture() {
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
            <UpLoad beforeUpload={handleBeforeUpload}/>
            <PictureList/>
        </>
    )
}

