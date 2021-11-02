import ajax from "./ajax";

export const login = (username, password) => ajax({
    url: '/user/login',
    method: 'post',
    data: {
        "username": username,
        "password": password
    }
});

export const register=(username,password)=>ajax({
    url:'/user/register',
    method:'post',
    data: {
        "username": username,
        "password": password
    }
});

export const myFiles = () => ajax({
    url: '/netdisk/nextList',
    method: 'post',
    data: {}
});

export const _deleteOk = (data) => ajax({
    url: '/netdisk/removeFileAndFolder',
    method: 'post',
    data
});

export const picList = () => ajax({
    url: '/netdisk/nextList?type=1',
    method: 'post',
    data: {}
});

export const docList=()=>ajax({
    url:'/netdisk/nextList?type=2',
    method:'post',
    data:{}
});

export const videoList=(data)=>ajax({
    url:'/netdisk/nextList',
    method:'post',
    data,
});

export const addFolder=(data)=>ajax({
    url:'/netdisk/addFolder',
    method:'post',
    data
});

export const _rename=(data)=>ajax({
    url:'/netdisk/reNameFolder',
    method:'post',
    data
});

export const nextFolderReq=(data)=>ajax({
    url:'/netdisk/nextList',
    method:'post',
    data
})
