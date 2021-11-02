import React from "react";
import {docList} from "../../api/index";
import {Upload, message, Table, Space, Image} from 'antd';
import { DeleteOutlined} from '@ant-design/icons';
import Utils from '../../common/Utils/Utils';
import filePng from "../../img/file.png";
import UpLoad from "../../common/UpLoad";
import Delete from "../../common/Delete";
import DownLoad from "../../common/DownLoad";
import ReName from "../../common/ReName";

export default class Doc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selectedRowKeys: [],
            DeleteVisible: false,
            newNameValue:''
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
        const {list, selectedRowKeys, pageNum, pageSize,newNameValue} = this.state
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
                <UpLoad beforeUpload={this.handleBeforeUpload}/>
                {
                    selectedRowKeys.length > 1 ?
                        <Delete icon={<DeleteOutlined/>} title={'批量删除'} type={'primary'}
                                selectedRowKeys={selectedRowKeys}
                                initEntry={this.initEntry}/> : null
                }
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
