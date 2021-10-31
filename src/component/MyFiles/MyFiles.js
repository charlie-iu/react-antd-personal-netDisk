import React, {useState, useEffect} from "react";
import {Button, Table, Space, Image, Modal, message, Upload, ConfigProvider, Input, Tree} from "antd";
import zhCN from 'antd/es/locale/zh_CN';
import {CloudUploadOutlined, FolderAddOutlined} from "@ant-design/icons";
import {myFiles, _deleteOk, addFolder, _rename} from '../../api/index';
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

const {DirectoryTree} = Tree;

function MyFiles(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [tData, setTData] = useState(0);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [pageNum, setPageNum] = useState(1);
    const [newFolderFlag, setNewFolderFlag] = useState(false);
    const [newNameValue, setNameValue] = useState('新建文件夹');
    const [renameModal, setRenameModal] = useState(false);
    const [renameValue, setRenameValue] = useState(newNameValue);
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        }
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
                window.timer = null;
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

    function showDeleteModal() {
        setDeleteVisible(true);
    }


    function deleteCancel() {
        setDeleteVisible(false);
    }

    function showRenameModal() {
        setRenameModal(true);
    }

    function renameCancel() {
        setRenameModal(false);
    }

    async function deleteOk(id) {
        let target = tData.find(data => Number(data.dataId) === Number(id));
        let formData = new FormData();
        switch (target.sourceType) {
            case 'FOLDER':
                formData.append('folderIds', id);
                break;
            case 'FILE':
                formData.append('fileIds', id);
                break;
            default:
                break;
        }
        try {
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

    async function ShowPageSizeChange(current, pageSize) {
        let pageNum = current;
        let _pageSize = pageSize;
        setPageNum(pageNum);
        setPageSize(_pageSize);
        await initEntry();
    }

    function showNewFolder() {
        setNewFolderFlag(true);
    }

    async function newFolder(id, name) {
        let formData = new FormData();
        formData.append('folderId', id ? id : 0);
        formData.append('folderName', name);
        try {
            await addFolder(formData);
            await initEntry();
        } catch (err) {
            return Promise.reject(err);
        }
        setNewFolderFlag(false);
    }

    function cancelNewFolder() {
        setNewFolderFlag(false);
    }

    function folderNameChange(e) {
        setNameValue(e.target.value);
    }

    async function rename(id) {
        let target = tData.find(data => Number(data.dataId) === Number(id));
        let formData = new FormData();
        if (id.length > 1) {
            message.warn('请单独勾选!');
            return;
        }
        if (renameValue === '') {
            message.warn('名称为空!');
            return;
        }
        if (renameValue === target.name) {
            // 这里逻辑有问题
            message.warn('名称未改变!');
            return;
        }

        switch (target.sourceType) {
            case 'FOLDER':
                formData.append('folderId', id);
                formData.append('folderName', renameValue)
                break;
            case 'FILE':
                formData.append('fileId', id);
                formData.append('fileName', renameValue);
                break;
            default:
                break;
        }
        try {
            await _rename(formData)
            await initEntry();
        } catch (err) {
            return Promise.reject(err);
        }
        setRenameModal(false);
    }

    async function renameChange(id, e) {
        // 先获取文件夹原来的名称，
        let target = tData.find(data => Number(data.dataId) === Number(id));
        setRenameValue(target.name);
        if (e.target.value !== target.name) {
            setRenameValue(e.target.value);
        }
        await initEntry();
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

                        <Button type='primary'
                                size='small'
                                shape='round'
                                onClick={showRenameModal}>重命名</Button>


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
                </>
            )
        }
    }
    ]
    return (
        <>
            <ConfigProvider locale={zhCN}>
                <div style={{display: 'inline-block'}}>
                    <Upload
                        headers={{Authorization: window.sessionStorage.getItem('token')}}
                        action="/netdisk/upload"
                        className="upload-list-inline"
                        multiple
                        onChange={uploadChange}
                    >
                        <Button className="antd-margin-right-08 antd-text-border-color-blue antd-margin-bottom-08"
                                icon={<CloudUploadOutlined/>}>上传</Button>
                    </Upload>
                </div>
                <Button onClick={showNewFolder}
                        className="antd-margin-right-08 antd-text-border-color-blue antd-margin-bottom-08"
                        icon={<FolderAddOutlined/>}
                >
                    新建
                </Button>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={tData}
                    rowKey='dataId'
                    pagination={{
                        size: 'small',
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSize,
                        total: totalPage,
                        current: pageNum,
                        onChange: async current => {
                            setPageNum(current);
                            await initEntry();
                        },
                        onShowSizeChange: ShowPageSizeChange
                    }}
                />
                <Modal
                    width={280}
                    title={<span>请输入文件夹名称</span>}
                    visible={newFolderFlag}
                    onOk={newFolder.bind(this, 0, newNameValue)}
                    onCancel={cancelNewFolder}
                    cancelText='取消'
                    okText='确认'
                    destroyOnClose={true}
                    mask={false}
                >
                    <Input value={newNameValue} onChange={folderNameChange}/>
                </Modal>

            </ConfigProvider>
        </>
    )
}

export default MyFiles;
