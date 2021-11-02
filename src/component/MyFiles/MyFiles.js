import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {Table, Space, Image} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {myFiles} from '../../api/index';
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
import DownLoad from "../../common/DownLoad";
import ReName from "../../common/ReName";
import Delete from "../../common/Delete";
import NewFolder from "../../common/NewFolder";
import SelectFileOrFolder from "../../common/SelectFileOrFolder/SelectFileOrFolder";


function MyFiles(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [tData, setTData] = useState(0);
    const [totalPage, setTotalPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [pageNum, setPageNum] = useState(1);
    const [newNameValue, setNameValue] = useState('新建文件夹');
    const rowSelection = {
        selectedRowKeys,
        onChange: selectedRowKeys => {
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
    }, []);

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

    async function ShowPageSizeChange(current, pageSize) {
        let pageNum = current;
        let _pageSize = pageSize;
        setPageNum(pageNum);
        setPageSize(_pageSize);
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
                            <Link to={`/myfiles/nextFolder/${record.dataId}/${record.name}`}>{text}</Link>
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
                    {/* 文件夹暂不支持下载*/}
                    <Space>
                        <DownLoad id={id} type={record.sourceType}/>
                        <ReName tData={tData} selectedRowKeys={selectedRowKeys} initEntry={initEntry}
                                newNameValue={newNameValue}/>
                        <Delete title={'删除'} type={'danger'} shape={'round'} selectedRowKeys={selectedRowKeys}
                                initEntry={initEntry}/>
                    </Space>

                </>
            )
        }
    }
    ]

    return (
        <>
            <SelectFileOrFolder/>
            <NewFolder initEntry={initEntry}/>
            {
                selectedRowKeys.length > 1 ?
                    <Delete icon={<DeleteOutlined/>} title={'批量删除'} type={'primary'}
                            selectedRowKeys={selectedRowKeys}
                            initEntry={initEntry}/> : null
            }

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

        </>
    )
}

export default MyFiles;
