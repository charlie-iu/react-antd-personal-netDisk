import React, {useEffect, useState} from "react";
import { Image, message, Space, Table, Upload} from "antd";
import {videoList} from '../../api/index';
import Utils from "../../common/Utils/Utils";
import videoPng from "../../img/VIDEO.png";
import UpLoad from "../../common/UpLoad";
import DownLoad from "../../common/DownLoad";
import ReName from "../../common/ReName";
import Delete from "../../common/Delete";

function Video() {
    const [tData, setTData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [pageNum, setPageNum] = useState(0);
    const[newNameValue,setNewNameValue]=useState('');
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
        setSelectedRowKeys(selectedRowKeys)
    }

    function beforeUpload(file) {
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
                            {
                                // 文件夹暂不支持下载
                                record.sourceType === 'FOLDER' ? null : <DownLoad id={id}/>
                            }
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
            <UpLoad beforeUpload={beforeUpload}/>
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
