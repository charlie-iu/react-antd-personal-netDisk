import React from 'react';
import {Form, Input, Checkbox, Button, message,} from 'antd';
import {register} from "./api";

export default function Register(props) {
    const [form] = Form.useForm();
    const onFinish = async values => {
        try {
            await register(values.username, values.password);
            message.success('注册成功!');
            props.history.replace('/login');
        } catch (err) {
            return Promise.reject(err);
        }
    };
    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 8,
            },
        },
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 16,
            },
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };
    return (
        <div className='register-box'>
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    tooltip="登录账号"
                    rules={[{required: true, message: '请输入您的用户名!', whitespace: true}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="nickname"
                    label="昵称"
                    tooltip="登录成功后的昵称"
                    rules={[{required: true, message: '请输入一个昵称!', whitespace: true}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                        {
                            type: 'email',
                            message: '无效邮箱!',
                        },
                        {
                            required: true,
                            message: '请输入您的邮箱!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入您的密码!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="确认密码"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: '请再次输入您的密码!',
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不一致，请重新输入!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                        },
                    ]}
                    {...tailFormItemLayout}
                >
                    <Checkbox>
                        我已阅读用户<span>协议书</span>
                    </Checkbox>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        注册
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
