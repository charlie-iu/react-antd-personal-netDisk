import React from "react";
import {Button, Tooltip} from "antd";

export default function DownLoad(props) {

    return (
        <div>
            {
                props.type === 'FILE' ? <a href={`http://47.119.129.231:8082/netdisk/download?fileId=${props.id}`}>
                    <Button
                        type='primary'
                        size='small'
                        shape='round'>
                        下载
                    </Button>
                </a> : <Tooltip title='文件夹暂不支持下载'>
                    <Button
                        type='primary'
                        size='small'
                        shape='round'>
                        下载
                    </Button>
                </Tooltip>
            }

        </div>

    )
}
