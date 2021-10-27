import React from "react";
import {docList, _deleteOk} from "../../api/index";
import {Upload, message, Button, Table, Space, Modal, Image} from 'antd';
import {CloudDownloadOutlined, CloudUploadOutlined} from '@ant-design/icons';
import Utils from '../../common/Utils/Utils';
import filePng from "../../img/file.png";

export default class Doc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedRowKeys: [],
            DeleteVisible: false,
        };
    }

    async componentDidMount() {
        await this.initEntry();
    }

    componentWillUnmount() {
        if (this.timer) {
            window.clearInterval(this.timer)
            this.timer = null;
        }
    }

    initEntry = async () => {
        try {
            const res = await docList();
            this.setState({
                ...res
            })
        } catch (err) {
            return Promise.reject(err);
        }
    }

    // checkbox状态
    handleSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys
        });
    };

    handleShowDeleteModal = () => {
        this.setState({
            DeleteVisible: true,
        });
    };

    handleDeleteOk = async ids => {
        let formData = new FormData();
        formData.append('fileIds', ids);
        try {
            await _deleteOk(formData);
            await this.initEntry();
        } catch (err) {
            return Promise.reject(err);
        }
        this.setState({
            DeleteVisible: false,
        })
    };

    handleDeleteCancel = () => {
        this.setState({
            DeleteVisible: false,
        });
    };

    handleMultipleDownload = (downloadKeys) => {
        downloadKeys.map(item => {
            return window.location.href = `http://47.119.129.231:8082/netdisk/download?fileId=${item}`;
        })
    }

    //文件上传状态
    handleUploadChange = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name}上传成功!`);
            this.timer = setInterval(() => {
                window.location.reload();
            }, 2000)
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name}上传失败!`);
        }
    }

    handleBeforeUpload = (file) => {
        const index = file.name.lastIndexOf('.')
        const uploadFileType = file.name.slice(index + 1);
        switch (uploadFileType) {
            case 'txt':
            case 'doc':
            case 'docx':
            case 'xls':
            case 'xlsx':
            case 'pdf':
            case 'ppt':
            case 'pptx':
                return true;
            default:
                message.error(`${file.name}不是文档格式，请检查后再上传!`);
                return Upload.LIST_IGNORE;
        }
    }

    render() {
        const {list, selectedRowKeys, DeleteVisible, pageNum, pageSize} = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleSelectChange
        };
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
                        <Image width={25} height={25} src={filePng} preview={false}/>
                        <span>{text}.{record.fileType}</span>
                    </Space>
                )

            }
        },
            {
                title: '修改时间',
                dataIndex: 'updateTime',
                render: text => <span>{Utils.dateFormat(new Date(text).getTime())}</span>
            },
            {
                title: '大小',
                dataIndex: 'size',
                render: text => Utils.fileSize(text)
            },
            {
                title: '更多',
                dataIndex: 'dataId',
                render: (id, record) => {
                    return (
                        <>
                            <Space>
                                <a href={`http://47.119.129.231:8082/netdisk/download?fileId=${id}`} download>
                                    <Button
                                        type='primary'
                                        size='small'
                                        shape='round'>
                                        下载
                                    </Button>
                                </a>
                                <Button type='danger' size='small' shape='round'
                                        onClick={this.handleShowDeleteModal}>删除</Button>
                            </Space>
                            <Modal
                                title={<span>确认删除?</span>}
                                visible={DeleteVisible}
                                onOk={selectedRowKeys.length > 0 ? this.handleDeleteOk.bind(this, selectedRowKeys) : this.handleDeleteCancel}
                                onCancel={this.handleDeleteCancel}
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
        ];
        return (
            <>
                <div style={{display: 'inline-block'}}>
                    <Upload
                        headers={{Authorization: window.sessionStorage.getItem('token')}}
                        action="http://localhost:3000/netdisk/upload"
                        className="upload-list-inline"
                        multiple
                        onChange={this.handleUploadChange}
                        beforeUpload={this.handleBeforeUpload}
                    >
                        <Button className="antd-margin-right-08 antd-text-border-color-blue antd-margin-bottom-08"
                                icon={<CloudUploadOutlined/>}>上传</Button>
                    </Upload>
                </div>
                <Space>
                    <Button className="antd-margin-right-08 antd-text-border-color-blue antd-margin-bottom-08"
                            icon={<CloudDownloadOutlined/>}
                            onClick={this.handleMultipleDownload.bind(this, selectedRowKeys)}>下载</Button>
                </Space>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={list}
                    rowKey='dataId'
                />
            </>
        )
    }
}
