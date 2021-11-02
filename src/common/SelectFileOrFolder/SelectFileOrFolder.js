import React, {useState} from "react";
import {Modal, Select} from "antd";
import UpLoad from "../UpLoad";

const {Option} = Select;
export default function SelectFileOrFolder() {
    const [upLoadFileModal, setUpLoadFileModal] = useState(false);
    const [upLoadFolderModal, setUpLoadFolderModal] = useState(false);

    function selectChange(value) {
        switch (value) {
            case 'file':
                setUpLoadFileModal(true);
                break;
            case 'folder':
                setUpLoadFolderModal(true);
                break;
            default:
                break;
        }
    }

    return (
        <>
            <Select className="antd-margin-right-08 antd-text-border-color-blue antd-margin-bottom-08"
                    defaultValue={'上传文件'}
                    size='small'
                    onChange={selectChange}
                    style={{width: 110}}>
                <Option value='file'>上传文件</Option>
                <Option value='folder'>上传文件夹</Option>
            </Select>
            <Modal
                bodyStyle={{paddingLeft: '100px'}}
                width={280}
                title={<span>选择文件</span>}
                visible={upLoadFileModal}
                onCancel={() => setUpLoadFileModal(false)}
                destroyOnClose={true}
                mask={false}
                footer={null}
            >
                <UpLoad/>
            </Modal>

            <Modal
                bodyStyle={{paddingLeft: '100px'}}
                width={280}
                title={<span>选择文件夹</span>}
                visible={upLoadFolderModal}
                onCancel={() => setUpLoadFolderModal(false)}
                destroyOnClose={true}
                mask={false}
                footer={null}
            >
                <UpLoad directory={true}/>
            </Modal>
        </>
    )
}
