import React from "react";
import {Layout, Menu} from 'antd';
import {UserOutlined, DeleteFilled, EyeFilled} from '@ant-design/icons';
import {Redirect, Route, Switch} from "react-router-dom";
import RouterList from "../RouterList";
import MyNavLink from "../component/MyNavLink/MyNavLink";
import Login from "../Login";
import Logo from "../img/cloud-sync.svg";

const {SubMenu} = Menu;
const {Content, Sider, Header} = Layout;
export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openKeys: ["sub1"],
            selectedKeys: '1',
            selectedMenuKey: '1'
        }
    };

    handleSelectedMenuKeyChange = ({key = ""}) => {
        this.setState({
            selectedMenuKey: key
        })
    };

    handleOpenKeysChange = (openKeys) => {
        this.setState({
            openKeys: openKeys
        })
    };

    render() {
        const {openKeys, selectedMenuKey} = this.state;
        let folder = RouterList.find(objList => objList.key === 1);
        let child = folder.children;
        console.log(child);
        return (
            <React.Fragment>
                <Layout>
                    <Header className='header'>
                        <div className='logo'>
                            <img src={Logo} alt='' style={{width: 142, height: 32, margin: "0 0 38px -48px"}}/>
                            <span>壹度网盘</span>
                        </div>
                    </Header>
                    <Content>
                        <Layout className="site-layout-background" style={{padding: '24px 0'}}>
                            <Sider className="site-layout-background" width={200}>
                                <Menu
                                    selectedKeys={[selectedMenuKey]}
                                    onClick={this.handleSelectedMenuKeyChange}
                                    onOpenChange={this.handleOpenKeysChange}
                                    openKeys={openKeys}
                                    mode="inline"
                                    style={{height: '100%'}}
                                >
                                    <SubMenu key="sub1" icon={<UserOutlined/>} title="我的文件">
                                        {RouterList.map(list =>
                                            <Menu.Item key={list.key}>
                                                <MyNavLink to={list.path}>{list.title}</MyNavLink>
                                            </Menu.Item>)}
                                    </SubMenu>
                                    <SubMenu key="sub2" icon={<DeleteFilled/>} title="回收站">
                                    </SubMenu>
                                    <SubMenu key="sub3" icon={<EyeFilled/>} title="快捷访问">
                                    </SubMenu>
                                </Menu>
                            </Sider>
                            <Content style={{margin: '0 24px 24', minHeight: 280}}>
                                <Switch>
                                    {
                                        window.sessionStorage.getItem('token') ? RouterList.map(item =>
                                                <Route key={item.key} path={item.path} component={item.component}/>) :
                                            <Redirect to='/login' component={Login}/>
                                    }
                                    <Route miss component={RouterList[0].component}/>
                                </Switch>
                            </Content>

                        </Layout>
                    </Content>
                </Layout>
            </React.Fragment>
        )
    }
}
