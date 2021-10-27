import React, {useEffect, useState} from "react";
import {Button, Image, message, Modal, Space, Table, Upload} from "antd";
import {CloudDownloadOutlined, CloudUploadOutlined} from "@ant-design/icons";
import axios from "axios";
import {videoList} from '../../api/index';
import Utils from "../../common/Utils/Utils";
import videoPng from "../../img/VIDEO.png";

function Video() {
    const [tData, setTData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [pageNum, setPageNum] = useState(0);
    const rowSelection = {
        selectedRowKeys,
        onChange: selectChange
    }
    useEffect( () => {
        (async function init(){
            await initEntry();
        })()
    }, [])

    async function initEntry() {
        const formData = new FormData();
        formData.append('type', '4');
        try {
            const res = await videoList(formData);
            setTData(res.list);
            setTotalPage(res.totalPage);
            setPageSize(res.pageSize);
            setPageNum(res.pageNum);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    // checkbox状态
    function selectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys)
    }

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

    function BeforeUpload(file) {
        const index = file.name.lastIndexOf('.')
        const uploadFileType = file.name.slice(index + 1);
        switch (uploadFileType) {
            case 'wav':
            case 'mp3':
            case 'ram':
            case 'avi':
            case 'mov':
            case 'mpeg':
            case 'mpg':
            case 'mp4':
                return true;
            default:
                message.error(`${file.name}不是视频格式，请检查后再上传!`);
                return Upload.LIST_IGNORE;
        }
    }

    function ShowDeleteModal() {
        setDeleteVisible(true);
    }

    function deleteOk(ids) {
        const formData = new FormData();
        formData.append('fileIds', ids);
        const url = '/netdisk/removeFileAndFolder'
        axios.post(url, formData).then(() => {
            message.success('删除成功!');
            this.initEntry();
        }).catch(err => {
            return err;
        })
        setDeleteVisible(false);
    }

    function deleteCancel() {
        setDeleteVisible(false);
    }

    function multipleDownload(downloadKeys) {
        downloadKeys.map(item => {
            return window.location.href = `http://47.119.129.231:8081/netdisk/download?fileId=${item}`;
        })
    }

    const columns = [{
        title: '序号',
        width: 60,
        align: 'center',
        render: (v, record, index) => index + 1 + (pageNum - 1) * pageSize
    }, {
            title: '文件名',
            dataIndex: 'name',
            render: (text, record) => {
                return (
                    <Space>
                        <Image width={25} height={25} src={videoPng} preview={false}/>
                        <span>{text}.{record.fileType}</span>
                    </Space>
                )
            }
        }, {
            title: '修改时间',
            dataIndex: 'updateTime',
            render: text => <span>{Utils.dateFormat(new Date(text).getTime())}</span>
        }, {
            title: '大小',
            dataIndex: 'size',
            render: text => Utils.fileSize(text)
        }, {
            title: '更多',
            dataIndex: 'dataId',
            render: (id, record) => {
                return (
                    <>
                        <Space>
                            <a href={`http://47.119.129.231:8081/netdisk/download?fileId=${id}`} download>
                                <Button
                                    type='primary'
                                    size='small'
                                    shape='round'
                                >
                                    下载
                                </Button>
                            </a>
                            <Button type='danger' size='small' shape='round'
                                    onClick={ShowDeleteModal}>删除</Button>
                        </Space>
                        <Modal
                            title={<span>确认删除?</span>}
                            visible={deleteVisible}
                            onOk={selectedRowKeys.length > 0 ? deleteOk.bind(this, selectedRowKeys) : deleteCancel}
                            onCancel={deleteCancel}
                            cancelText='取消'
                            okText='确认'
                            destroyOnClose={true}
                            mask={false}
                        >
                            {
                                selectedRowKeys.length > 0 ? <p>删除后不可还原哦！</p> : <p>请先勾选删除项!</p>
                            }
                        </Modal>
                    </>
                )
            }
        }
    ]
    return (
        <>
            <div style={{display: 'inline-block'}}>
                <Upload
                    headers={{Authorization: window.sessionStorage.getItem('token')}}
                    action="http://localhost:3000/netdisk/upload"
                    className="upload-list-inline"
                    multiple
                    onChange={uploadChange}
                    beforeUpload={BeforeUpload}
                >
                    <Button className="antd-margin-right-08 antd-text-border-color-blue antd-margin-bottom-08"
                            icon={<CloudUploadOutlined/>}>上传</Button>
                </Upload>
            </div>
            <Space>
                <Button className="antd-margin-right-08 antd-text-border-color-blue antd-margin-bottom-08"
                        icon={<CloudDownloadOutlined/>}
                        onClick={multipleDownload.bind(this, selectedRowKeys)}>下载</Button>
            </Space>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={tData}
                rowKey='dataId'
            />
        </>
    )
}

export default Video;
