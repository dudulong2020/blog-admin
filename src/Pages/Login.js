import React, { useState } from 'react';
import { useNavigate, } from "react-router-dom";
import axios from 'axios';
import servicePath from './config/apiUrl';

import 'antd/dist/antd.css';
import { Card, Input, Icon, Button, Spin, message } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';

import '../static/css/Login.css';


const Login = () => {

  let navigate = useNavigate();
  
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const checkLogin = () => {
    setIsLoading(true)

    if (!userName) {
      message.error('用户名不能为空')
      return false
    } else if (!password) {
      message.error('密码不能为空')
      return false
    }
    let dataProps = {
      'userName': userName,
      'password': password
    }
    axios({
      method: 'post',
      url: servicePath.checkLogin,
      data: dataProps,
      withCredentials: true
    }).then(
      res => {
        setIsLoading(false)
        if (res.data.data == '登录成功') {
          localStorage.setItem('openId', res.data.openId)
          navigate('/');
        } else {
          message.error('用户名密码错误')
        }
      }
    )

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }




  return (
    <div className='login-div'>
      <Spin tip="Loading..." spinning={isLoading}>
        <Card title='NEXT BLOG LOGIN' bordered={true} style={{ width: 400 }}>
          <Input
            id='username'
            size='large'
            placeholder='Enter your userName'
            // prefix={<Iocn type='user' style={{ color: 'rgba(0.0.0..25)' }} />}
            prefix={<UserOutlined style={{ color: 'rgba(0.0.0..25)' }} />}
            onChange={(e) => setUserName(e.target.value)}
          />
          <br /><br />
          <Input.Password id='password' size='large' placeholder='Enter your password'
            // prefix={<Iocn type='user' style={{ color: 'rgba(0.0.0..25)' }} />}
            prefix={<KeyOutlined style={{ color: 'rgba(0.0.0..25)' }} />}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />
          <Button type="primary" size='large' block onClick={checkLogin}>Login In</Button>

        </Card>
      </Spin>
    </div>
  )
}


export default Login