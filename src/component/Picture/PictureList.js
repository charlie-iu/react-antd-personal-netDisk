import React from 'react';
import {Table, Image, Modal, Button, Space} from 'antd';
import {picList, _deleteOk} from '../../api/index';
import {CloudDownloadOutlined, DeleteOutlined} from "@ant-design/icons";
import Utils from "../../common/Utils/Utils";
import Delete from "../../common/Delete";
import DownLoad from "../../common/DownLoad";
import ReName from "../../common/ReName";


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
            addFolderVisible: false,
            newNameValue:''
        }
    }

    async componentDidMount() {
        await this.initEntry();
    }

    initEntry = async () => {
        try {
           const res= await picList();
            // console.log(res);
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
        const {list, selectedRowKeys, pageNum, pageSize, deleteVisible,newNameValue} = this.state;
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
                                {
                                    // 文件夹暂不支持下载
                                    record.sourceType === 'FOLDER' ? null : <DownLoad id={id}/>
                                }
                                <ReName tData={list} selectedRowKeys={selectedRowKeys} initEntry={this.initEntry}
                                        newNameValue={newNameValue}/>
                                <Delete title={'删除'} type={'danger'} shape={'round'} selectedRowKeys={selectedRowKeys}
                                        initEntry={this.initEntry}/>
                            </Space>
                        </>
                    )
                }
            }
        ];

        return (
            <>
                <Space>
                    {
                        selectedRowKeys.length > 1 ?
                            <Delete icon={<DeleteOutlined/>} title={'批量删除'} type={'primary'}
                                    selectedRowKeys={selectedRowKeys}
                                    initEntry={this.initEntry}/> : null
                    }
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

