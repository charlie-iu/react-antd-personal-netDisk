import React, { useEffect, useReducer } from 'react';
import { Table, Space, Popconfirm, Modal, Form ,Input, message } from 'antd';
import { CloudDownloadOutlined, EditOutlined } from "@ant-design/icons";
import _ from 'lodash';
import { Ajax, Utils, C } from '../../common';
import { ShowFileName } from '../../component';
import Reducer from './Reducer';

export default function AllFileList(props) {
  const [state, dispatch] = useReducer(Reducer, {
    selectedRowKeys: [],
    dataSource: [],
    total: 0,
    pageSize: 10,
    currentPage: 1,
    modalAction: '',
    modalData: {},
    showModal: false,
    newFolderName: ''
  });

  const initEntry = () => {
    const data = {
      pageSize: state.pageSize,
      currentPage: state.currentPage,
      folderId: 0,
      type: 0,
      deleted: 0
    }
    Ajax.getFoldersAndFilesRequest(data).then(res => {
      dispatch({
        type: 'UPDATE_DATA_SOURCE',
        payload: res.list,
      });
      dispatch({
        type: 'UPDATE_TOTAL',
        payload: res.total,
      });
    });
  }


  useEffect(() => {
    initEntry();

  }, [state.pageSize, state.currentPage])

  const rowSelection = {
    selectedRowKeys: state.selectedRowKeys,
    onChange: selectedRowKeys => {
      dispatch({
        type: 'UPDATE_SELECTEDROWKEYS',
        payload: selectedRowKeys,
      });
    }
  };

  const onShowSizeChange = (currentPage, pageSize) => {
    dispatch({
      type: 'UPDATE_CURRENT_PAGE',
      payload: currentPage,
    });
    dispatch({
      type: 'UPDATE_PAGE_SIZE',
      payload: pageSize,
    });
  };
  const pagination = {
    size: 'small',
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: state.pageSize,
    total: state.total,
    currentPage: state.currentPage,
    onChange: current => {
      dispatch({
        type: 'UPDATE_CURRENT_PAGE',
        payload: current
      });
      initEntry();
    },
    onShowSizeChange
  };
  const handleDownload = (id) => {
    window.open(`http://47.119.129.231:8082/netdisk/download?fileId=${id}`);
  };
  const handleShowModal = (moalAction = '', modalData = {}) => {
    dispatch({
      type: 'UPDATE_MODAL_ACTION',
      payload: moalAction
    });
    dispatch({
      type: 'UPDATE_MODAL_DATA',
      payload: modalData
    });
    dispatch({
      type: 'UPDATE_SHOW_MODAL',
      payload: true
    });

  };
  const handleOk = () => {
    dispatch({
      type: 'UPDATE_SHOW_MODAL',
      payload: false
    });
  };
  const handleCancel = () => {
    dispatch({
      type: 'UPDATE_SHOW_MODAL',
      payload: false
    });
  };
  const handleChange = e => {
    const {name, value} = e.target;
    dispatch({
      type: 'UPDATE_FORM_VALUE',
      payload: {name, value}
    });
  };
  const handleReName = () => {
    const modalData = state.modalData;
    const params = {
      folderId: modalData.dataId,
      folderName: state.newFolderName
    };
    Ajax.reName(params).then(res=>{
      message.success('重命名成功');
      initEntry();
      dispatch({
        type: 'UPDATE_SHOW_MODAL',
        payload: false
      })
    })

  }
  const columns = [{
    title: '序号',
    width: 60,
    align: 'center',
    render: (v, record, index) => index + 1 + (state.currentPage - 1) * state.pageSize
  }, {
    title: '文件名',
    dataIndex: 'name',
    render: (text, record) => <ShowFileName data={record} />
  }, {
    title: '修改时间',
    dataIndex: 'updateTime',
    render: text => Utils.getTimeFromStr(text)
  }, {
    title: '大小',
    dataIndex: 'size',
    render: text => Utils.getFileSize(text)
  }, {
    title: '操作',
    dataIndex: 'dataId',
    render: (id, record) => {
      return (
        <Space>
          <Popconfirm
            title="确认下载?"
            onConfirm={() => handleDownload(id)}
            okText="确认"
            cancelText="取消"
          >
            <a
              href='javascript: void 0;'
            >
              下载 <CloudDownloadOutlined />
            </a>
          </Popconfirm>
          {record.sourceType === 'FOLDER' && (
            <a
              href='javascript: void 0;'
              onClick={() => { handleShowModal(C.RE_NAME, record) }}
            >
              重命名 <EditOutlined />
            </a>
          )
          }

        </Space>
      )
    }
  }
  ];
  const tableProps = {
    columns,
    rowSelection,
    pagination,
    dataSource: state.dataSource,
    columns,
    rowKey: 'dataId'
  };
  let modalProps = {
    visible: state.showModal,
    onOk: handleOk,
    onCancel: handleCancel
  };
  let modalSubItem = null;
  if (state.showModal) {
    switch (state.modalAction) {
      case C.RE_NAME:
        modalProps.title = '重命名';
        modalProps.onOk = handleReName
        modalSubItem = (
          <Form
          layout='vertical'
            // {...FormItemLayout}
          >
            <Form.Item
              label='名称'
            >
              <Input
                size='small'
                placeholder='输入新文件夹名称'
                name='newFolderName'
                value={state.newFolderName}
                onChange={(e)=>handleChange(e)}
              />
            </Form.Item>
          </Form>
        )
    }
  }


  return (
    <>
      <Table {...tableProps} />
      <Modal {...modalProps} >
        {modalSubItem}
      </Modal>
    </>
  )
}
