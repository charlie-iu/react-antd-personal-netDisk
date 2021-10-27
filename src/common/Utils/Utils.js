// 时间格式转换

function dateFormat(timestamp) {
    const date = new Date(timestamp.toString().length === 13 ? Number(timestamp) : timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}

//文件大小转化
function fileSize(text) {
    let res = '';
    if (text >= 1024) {
        res = text % 1024 === 0 ? text % 1024 + 'KB' : Math.trunc(text % 1024) + 'KB'
    } else if (text >= 1024 * 1024) {
        res = text % (1024 * 1024) === 0 ? text % (1024 * 1024) + 'MB' : Math.trunc(text % (1024 * 1024)) + 'MB'
    } else if (text >= 1024 * 1024 * 1024) {
        res = text % (1024 * 1024 * 1024) === 0 ? text % (1024 * 1024 * 1024) + 'KB' : Math.trunc(text % (1024 * 1024 * 1024)) + 'KB'
    } else if (text === null) {
        res = '-'
    } else {
        res = text + 'B'
    }
    return res;
}


const Utils = {
    dateFormat,
    fileSize,
}
export default Utils;