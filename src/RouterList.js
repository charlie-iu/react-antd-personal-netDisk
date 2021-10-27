import MyFiles from "./component/MyFiles/MyFiles";
import Picture from "./component/Picture/Picture";
import Doc from "./component/Doc/Doc";
import Video from "./component/Video/Video";


const routerList = [{
    title: '所有文件',
    path: '/myfiles',
    component: MyFiles
}, {
    title: '图片',
    path: '/picture',
    component: Picture
}, {
    title: '文档',
    path: '/doc',
    component: Doc
}, {
    title: '视频',
    path: '/video',
    component: Video
}]

export default routerList;
