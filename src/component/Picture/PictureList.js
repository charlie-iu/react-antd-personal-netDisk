import React from 'react';
import {Table, Image, Modal, Button, Space} from 'antd';
import {picList, _deleteOk} from '../../api/index';
import {CloudDownloadOutlined} from "@ant-design/icons";
import Utils from "../../common/Utils/Utils";


export default class PictureList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            totalPage: 1,
            pageSize: 1,
            pageNum: 1,
            selectedRowKeys: [],
            deleteVisible: false,
            addFolderVisible: false
        }
    }

    async componentDidMount() {
        await this.initEntry();
    }

    initEntry = async () => {
        try {
           const res= await picList();
            this.setState({
               list:res.list
           })
        } catch (err) {
            return Promise.reject(err);
        }
    }
    // checkbox状态
    handleSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({
            selectedRowKeys
        });
    };

    handleShowDeleteModal = () => {
        this.setState({
            deleteVisible: true,
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
            deleteVisible: false,
        });
    };

    handleDeleteCancel = () => {
        this.setState({
            deleteVisible: false,
        });
    };

    handleMultipleDownload = (downloadKeys) => {
        downloadKeys.map(item => {
            return window.location.href = `http://47.119.129.231:8082/netdisk/download?fileId=${item}`;
        })
    }


    render() {
        const {list, selectedRowKeys, pageNum, pageSize, deleteVisible} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleSelectChange
        };
        const columns = [
            {
                title: '序号',
                width: 60,
                align: 'center',
                render: (v, record, index) => index + 1 + (pageNum - 1) * pageSize
            },
            {
                title: '预览',
                dataIndex: 'thumbPath',
                render: v => <Image width={25} height={25} src={v}/>
            },
            {
                title: '文件名',
                dataIndex: 'name',
                render: (text, record) => <span>{text}.{record.fileType}</span>,
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
                                visible={deleteVisible}
                                onOk={selectedRowKeys.length > 0 ? this.handleDeleteOk.bind(this,selectedRowKeys) : this.handleDeleteCancel}
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
                <Space>
                    <Button className=" antd-text-border-color-blue"
                            icon={<CloudDownloadOutlined/>}
                            onClick={this.handleMultipleDownload.bind(this, selectedRowKeys)}
                    >下载
                    </Button>
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

