import MyFiles from "./component/MyFiles/MyFiles";
import Picture from "./component/Picture/Picture";
import Doc from "./component/Doc/Doc";
import Video from "./component/Video/Video";
import NextFolder from "./component/NextFolder/NextFolder";

const routerList = [{
    key:1,
    title: '所有文件',
    path: '/myfiles',
    component: MyFiles,
}, {
    key:2,
    title: '图片',
    path: '/picture',
    component: Picture,
}, {
    key:3,
    title: '文档',
    path: '/doc',
    component: Doc,
}, {
    key:4,
    title: '视频',
    path: '/video',
    component: Video
}]
export default routerList;
