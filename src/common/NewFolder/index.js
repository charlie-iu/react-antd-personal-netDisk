import React, {useState} from "react";
import {Button, Input, Modal} from "antd";
import {FolderAddOutlined} from "@ant-design/icons";
import {addFolder} from "../../api";

export default function NewFolder(props) {
    const [newFolderFlag, setNewFolderFlag] = useState(false);
    const [newNameValue, setNameValue] = useState('新建文件夹');
    function showNewFolder() {
        setNewFolderFlag(true);
    }

    async function newFolder(id, name) {
        let formData = new FormData();
        formData.append('folderId', id ? id : 0);
        formData.append('folderName', name);
        try {
            await addFolder(formData);
            await props.initEntry();
        } catch (err) {
            return Promise.reject(err);
        }
        setNewFolderFlag(false);
    }
    function folderNameChange(e) {
        setNameValue(e.target.value);
    }

    return (
        <div style={{display:'inline-block'}}>
            <Button onClick={showNewFolder}
                    size='small'
                    className="antd-margin-right-08 antd-text-border-color-blue antd-margin-bottom-08"
                    icon={<FolderAddOutlined/>}
            >
                新建
            </Button>
            <Modal
                width={280}
                title={<span>请输入文件夹名称</span>}
                visible={newFolderFlag}
                onOk={newFolder.bind(this, 0, newNameValue)}
                onCancel={() => setNewFolderFlag(false)}
                cancelText='取消'
                okText='确认'
                destroyOnClose={true}
                mask={false}
            >
                <Input value={newNameValue} onChange={folderNameChange}/>
            </Modal>
        </div>
    )
}