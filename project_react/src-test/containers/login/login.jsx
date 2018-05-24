/*=================登录路由组件=============*/
import React,{Component} from 'react'
//引入UI组件库中的组件
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    Radio,
    Button,
    WhiteSpace
} from 'antd-mobile'


import Logo from '../../components/logo/logo'

export default class Login extends Component{
    state = {
        username:'',
        password:''
    }
    handdleChange = (name,val)=>{
        this.setState({
            [name]:val
        })
    }
    //登录按钮的实现
    login = ()=>{
        console.log(this.state)
    }
    //已有用户的跳转
    toRegister = ()=>{
        this.props.history.replacer('/register')
    }
    render(){
        return (
            <div>
                <NavBar>硅&nbsp;&nbsp;谷&nbsp;&nbsp;直&nbsp;&nbsp;聘</NavBar>
                <Logo></Logo>
                <List>
                    <WingBlank>
                        <InputItem onChange={(val)=>(this.handdleChange('username',val))} placeholder='请输入用户名'>用户名：</InputItem>
                        <WhiteSpace/>
                        <InputItem type='password' onChange={(val)=>(this.handdleChange('password',val))} placeholder='请输入密码'>密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace/>
                        <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;&nbsp;录</Button>
                        <Button onClick={this.toRegister}>还没有用户</Button>
                    </WingBlank>
                </List>
            </div>
        )
    }
}