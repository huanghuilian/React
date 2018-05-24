//注册的路由组件
import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import {NavBar,Button,InputItem,Radio,WingBlank,WhiteSpace,List} from 'antd-mobile'
import {connect} from 'react-redux'

import {register} from '../../redux/actions'
import Logo from '../../components/logo/logo'
//将Register组件包装成容器组件
class Register extends Component{
    state = {
       username:'',
        password:'',
        password2:'',
        type:'dashen'
    }
    // 待从容器组件中传递过来的props数据
   /* static propTypes = {
        register:PropTypes.func.isRequired ,//用于发送请求的方法，源来自于actions创建的模块
        toRedirect:PropTypes.string.isRequired,//用于注册成功自己登录进入主界面的跳转路由的路径
        msg:PropTypes.string.isRequired //表示注册失败的错误信息
    }*/
    //处理输入内容变化更新状态
    handdleChange = (type,val)=>{
        this.setState({
        [type]:val //表示更新的是type的值而不是type属性
        })
    }
    //注册按钮的事件回调
    register = ()=>{
        this.props.register(this.state)
    }
    //已有账号按钮的实现：回到登录界面
    toLogin = ()=>{
        this.props.history.replace('/login')
    }
    render(){
        const {toRedirect,msg} = this.props.user
        if (toRedirect){ //如果有跳转的路由则进行跳转
            return <Redirect to={toRedirect}></Redirect>
        }
        return (
            <div>
                <NavBar>硅&nbsp;&nbsp;谷&nbsp;&nbsp;直&nbsp;&nbsp;聘</NavBar>
                <Logo/>
                <WingBlank>
                    {msg ? <p className='error-msg'>{msg}</p> : null}
                    <List>
                        <InputItem placeholder='请输入用户名' onChange={(val)=>{this.handdleChange('username',val)}}>用户名：</InputItem>
                        <WhiteSpace/>
                        <InputItem placeholder='请输入密码' type='password' onChange={(val)=>{this.handdleChange('password',val)}}>密码：</InputItem>
                        <WhiteSpace/>
                        <InputItem placeholder='请输入确认密码' type='password' onChange={(val)=>{this.handdleChange('password2',val)}}>确认密码：</InputItem>
                        <WhiteSpace/>
                        <List.Item>
                            <span style={{marginRight:30}}>用户类型:</span>
                            <Radio checked={this.state.type==='dashen'} onChange={()=>{this.handdleChange('type','dashen')}}>大神</Radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={this.state.type==='laoban'} onChange={()=>{this.handdleChange('type','laoban')}}>老板</Radio>
                        </List.Item>
                        <WhiteSpace/>
                        <Button type='primary' onClick={this.register}>注册</Button>
                        <WhiteSpace/>
                        <Button type='default' onClick={this.toLogin}>已有账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

//reducer函数向外暴露的是一个状态对象{user：{username,type，msg,toRedirect}}
/*  需要传递的参数有：Register这是发请求的
    Register:PropTypes.func.isRequired ,//用于发送请求的方法，源来自于actions创建的模块
    toRedirect:PropTypes.string.isRequired,//用于注册成功自己登录进入主界面的跳转路由的路径
    msg:PropTypes.string.isRequired //表示注册失败的错误信息
* */
export default connect(
    (state)=>({user:state.user}),
    {register}
)(Register)
