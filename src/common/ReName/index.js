import React, {useEffect, useState} from "react";
import {Button, Input, message, Modal} from "antd";
import {_rename} from "../../api";

export default function ReName(props) {
    let {tData, selectedRowKeys, newNameValue} = props;
    const [renameModal, setRenameModal] = useState(false);
    const [renameValue, setRenameValue] = useState('');

    useEffect(() => {
        setRenameValue(newNameValue);
    }, [newNameValue])

    function showRenameModal() {
        setRenameModal(true);
    }

    async function rename(id) {
        let target = tData.find(list => Number(list.dataId) === Number(id))
        let obj = {...target}
        let formData = new FormData();
        if (id.length > 1) {
            message.warn('请单独勾选!');
            return;
        }
        if (renameValue === '') {
            message.warn('名称为空!');
            return;
        }
        formData.append('folderId', id);
        formData.append('folderName', renameValue);
        formData.append('fileId', id);
        formData.append('fileName', renameValue);

        try {
            if (renameValue === obj.name) {
                message.warn('已存在相同文件名的文件夹!');
                return;
            }
            await _rename(formData);
            await props.initEntry();

        } catch (err) {
            message.error('重命名失败!');
            return;
        }
        setRenameModal(false);
        message.success('重命名成功!');
    }

    function renameCancel() {
        setRenameModal(false);
    }

    async function renameChange(id, e) {
        // 先获取文件夹原来的名称，
        let target = tData.find(data => Number(data.dataId) === Number(id));
        setRenameValue(target.name);
        if (e.target.value === target.name) {
            message.warn('已存在相同文件名的文件夹!');
        } else {
            setRenameValue(e.target.value);
        }
        await props.initEntry();
    }

    return (
        <div>
            <Button type='primary'
                    size='small'
                    shape='round'
                    onClick={showRenameModal}
            >重命名
            </Button>
            <Modal
                width={300}
                title={<span>请重命名</span>}
                visible={renameModal}
                onOk={rename.bind(this, selectedRowKeys)}
                onCancel={renameCancel}
                cancelText='取消'
                okText='确认'
                destroyOnClose={true}
                mask={false}
            >
                {
                    selectedRowKeys.length === 0 && <p>请先勾选!</p>
                }
                {
                    selectedRowKeys.length === 1 &&
                    < Input value={renameValue} onChange={renameChange.bind(this, selectedRowKeys)}/>
                }
                {
                    selectedRowKeys.length > 1 && <p>请单独勾选!</p>
                }

            </Modal>
        </div>
    )
}
