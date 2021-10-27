import React, {useState, useEffect} from "react";
import {Button, Table, Space, Image, Modal, message, Upload} from "antd";
import {CloudUploadOutlined, FolderAddOutlined} from "@ant-design/icons";
import {myFiles, _deleteOk} from '../../api/index';
import Utils from "../../common/Utils/Utils";
import folderPng from "../../img/folder.png";
import txtPng from "../../img/txt.png";
import docPng from "../../img/docx.png";
import xlsPng from "../../img/xlsx.png";
import pdfPng from "../../img/pdf.png";
import pptPng from "../../img/pptx.png";
import zipPng from "../../img/zip.png";
import picPng from "../../img/picture.png";
import filePng from "../../img/file.png";
import videoPng from "../../img/VIDEO.png";

function MyFiles(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [tData, setTData] = useState(0);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [pageNum, setPageNum] = useState(0);
    const rowSelection = {
        selectedRowKeys,
        onChange: selectChange
    }

    useEffect(() => {
        (async function init() {
            try {
                await initEntry();
            } catch (err) {
                return Promise.reject(err);
            }
        })()
        return () => {
            if (window.timer) {
                window.clearInterval(window.timer)
                this.timer = null;
            }
        }
    }, [props.match.params.tData]);

    async function initEntry() {
        try {
            let res = await myFiles();
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
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys)
    }

    function showDeleteModal() {
        setDeleteVisible(true);
    }

    function deleteCancel() {
        setDeleteVisible(false);
    }

    async function deleteOk(ids) {
        try {
            let formData = new FormData();
            formData.append('fileIds', ids);
            await _deleteOk(formData);
            await initEntry();
        } catch (err) {
            return Promise.reject(err);
        }
        setDeleteVisible(false);
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

    const columns = [{
        title: '序号',
        width: 60,
        align: 'center',
        render: (v, record, index) => index + 1 + (pageNum - 1) * pageSize
    }, {
        title: '文件名',
        dataIndex: 'name',
        render: (text, record) => {
            switch (record.sourceType) {
                case 'FOLDER':
                    return (
                        <Space>
                            <Image width={25} height={25} src={folderPng} preview={false}/>
                            <span>{text}</span>
                        </Space>
                    )
                default:
                    break;
            }
            switch (record.fileType) {
                case 'txt':
                    return (
                        <Space>
                            <Image width={25} height={25} src={txtPng} preview={false}/>
                            <span>{text}</span>
                        </Space>)
                case 'doc':
                case 'docx':
                    return (
                        <Space>
                            <Image width={25} height={25} src={docPng} preview={false}/>
                            <span>{text}</span>
                        </Space>
                    )
                case 'xls':
                case 'xlsx':
                    return (
                        <Space>
                            <Image width={25} height={25} src={xlsPng} preview={false}/>
                            <span>{text}</span>
                        </Space>
                    )
                case 'pdf':
                    return (
                        <Space>
                            <Image width={25} height={25} src={pdfPng} preview={false}/>
                            <span>{text}</span>
                        </Space>
                    )
                case 'ppt':
                case 'pptx':
                    return (
                        <Space>
                            <Image width={25} height={25} src={pptPng} preview={false}/>
                            <span>{text}</span>
                        </Space>
                    )
                case 'zip':
                    return (
                        <Space>
                            <Image width={25} height={25} src={zipPng} preview={false}/>
                            <span>{text}</span>
                        </Space>
                    )
                case 'jpg':
                case 'png':
                case 'jpeg':
                case 'gif':
                case 'bmp':
                    return (
                        <Space>
                            <Image width={25} height={25} src={picPng} preview={false}/>
                            <span>{text}</span>
                        </Space>
                    )
                case 'wav':
                case 'mp3':
                case 'ram':
                case 'avi':
                case 'mov':
                case 'mpeg':
                case 'mpg':
                case 'mp4':
                    return (
                        <Space>
                            <Image width={25} height={25} src={videoPng} preview={false}/>
                            <span>{text}.{record.fileType}</span>
                        </Space>
                    )
                default:
                    return (
                        <Space>
                            <Image width={25} height={25} src={filePng} preview={false}/>
                            <span>{text}</span>
                        </Space>
                    )
            }
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
                        <a href={`http://47.119.129.231:8082/netdisk/download?fileId=${id}`}>
                            <Button
                                type='primary'
                                size='small'
                                shape='round'>
                                下载
                            </Button>
                        </a>

                        <Button type='danger' size='small' shape='round'
                                onClick={showDeleteModal}>删除</Button>
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
                >
                    <Button className="antd-margin-right-08 antd-text-border-color-blue antd-margin-bottom-08"
                            icon={<CloudUploadOutlined/>}>上传</Button>
                </Upload>
            </div>
            <Button className="antd-margin-right-08 antd-text-border-color-blue antd-margin-bottom-08"
                    icon={<FolderAddOutlined/>}
            >
                新建
            </Button>
            <div className='antd-margin-bottom-08'> 全部文件</div>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={tData}
                rowKey='dataId'
            />
        </>
    )
}

export default MyFiles;
