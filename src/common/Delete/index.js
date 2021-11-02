import React, {useState} from "react";
import {Button, message, Modal} from "antd";
import {_deleteOk} from "../../api";

export default function Delete(props) {
    let {title, selectedRowKeys, type, shape, icon} = props;
    const [deleteVisible, setDeleteVisible] = useState(false);

    function showDeleteModal() {
        setDeleteVisible(true);
    }

    async function deleteOk(id) {
        let formData = new FormData();
        formData.append('folderIds', id);
        formData.append('fileIds', id);
        try {
            if (id.length === 1) {
                await _deleteOk(formData);
                message.success('删除成功!');
                await props.initEntry();
            } else if (id.length >= 1) {
                await _deleteOk(formData);
                message.success('批量删除成功!');
                await props.initEntry();
            }
        } catch (err) {
            return Promise.reject(err);
        }
        setDeleteVisible(false);
    }

    function deleteCancel() {
        setDeleteVisible(false);
    }

    return (
        <div style={{display: 'inline-block'}}>
            <Button type={type} size='small' shape={shape} icon={icon}
                    onClick={showDeleteModal}>{title}</Button>
            <Modal
                width={300}
                visible={deleteVisible}
                onOk={deleteOk.bind(this, selectedRowKeys)}
                onCancel={deleteCancel}
                destroyOnClose={true}
                mask={false}
            >
                {
                    selectedRowKeys.length === 0 && <div>请先勾选要删除的文件(夹)!</div>
                }
                {
                    selectedRowKeys.length === 1 && <div>确认删除该文件(夹)!</div>
                }
                {
                    selectedRowKeys.length > 1 && <div>确认删除所勾选的{selectedRowKeys.length}个文件(夹)!</div>
                }
            </Modal>
        </div>
    )
}
