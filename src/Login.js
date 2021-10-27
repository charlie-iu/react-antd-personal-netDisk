import React from "react";
import {Form, Input, Button, Checkbox, message} from 'antd';
import {UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';
import {login} from "./api";
import MyNavLink from "./component/MyNavLink/MyNavLink";

export default function Login(props) {
    async function onFinish(values) {
        try{
            let res = await login(values.username, values.password);
            const tokenHeader = res.tokenHeader;
            const token = res.token;
            const Token = `${tokenHeader} ${token}`; //中间需要有一个空格分开
            window.sessionStorage.setItem('token', Token);
            props.history.replace('/');
            message.success('欢迎登录!');
        }catch (err){
            return Promise.reject(err);
        }
    }

    return (
        <div className='Login-box login-bgc'>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入您的用户名!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                           placeholder="用户名" allowClear/>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码!',
                        },
                    ]}
                >
                    <Input.Password
                        maxLength={16}
                        allowClear
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                        placeholder="密码"
                        iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>

                    <span className="login-form-forgot" >
                        忘记密码？
                    </span>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                    <MyNavLink to='/register'>没有账号？立马注册!</MyNavLink>
                </Form.Item>
            </Form>
        </div>
    )
}
