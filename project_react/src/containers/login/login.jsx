//登录的路由组件
import React,{Component} from 'react'
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {login} from '../../redux/actions'
class Login extends Component{
    state = {
        username:'',
        password:''
    }

    //处理输入内容变化更新状态
    handdleChange = (type,val)=>{
        this.setState({
            [type]:val //表示更新的是type的值而不是type属性
        })
    }
    //登录按钮的事件回调
    login = ()=>{ //点击登录按钮
        //  login()由容器组件传递过来的异步action函数
        this.props.login(this.state) //分发一个异步action
    }
    //已有账号按钮的实现：回到登录界面
    toRegister = ()=>{
        this.props.history.replace('/register')
    }
    render(){

        const {msg,toRedirect} = this.props.user
        if (toRedirect){
            return <Redirect to={toRedirect}></Redirect>
        }
        return (
            <div>
                <NavBar>硅&nbsp;&nbsp;谷&nbsp;&nbsp;直&nbsp;&nbsp;聘</NavBar>
                <Logo/>
                <WingBlank>
                    <List>
                        { msg ? <p className= 'error-msg'>{msg}</p> : null }
                        <InputItem placeholder='请输入用户名' onChange={(val)=>{this.handdleChange('username',val)}}>用户名：</InputItem>
                        <WhiteSpace/>
                        <InputItem placeholder='请输入密码' type='password' onChange={(val)=>{this.handdleChange('password',val)}}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace/>
                        <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;&nbsp;录</Button>
                        <WhiteSpace/>
                        <Button type='default' onClick={this.toRegister}>未有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
/* user是reducer函数中管理的状态 {username，type，msg，toRedirect}
* */
export default connect(
    state=>({user:state.user}),
    {login}
)(Login)