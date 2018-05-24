/*=================注册路由组件=============*/
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
import {connect} from 'react-redux'
import Logo from '../../components/logo/logo'
import {register} from '../../redux/actions'
const ListItem = List.Item
class Register extends Component{
    state = {
        username:'',
        password:'',
        password2:'',
        type:'dashen'
    }
    handdleChange = (name,val)=>{
        this.setState({
            [name]:val
        })
    }
    //注册按钮的实现
    register = ()=>{
        this.props.register(this.state)
    }
    //已有用户的跳转
    toLogin = ()=>{
        this.props.history.replacer('/login')
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
                        <InputItem type='password' onChange={(val)=>(this.handdleChange('password2',val))} placeholder='请输入确认密码'>确认密码:</InputItem>
                        <WhiteSpace/>
                        <ListItem>
                            <span>用户类型:</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={this.state.type==='dashen'} onChange={()=>(this.handdleChange('type','dashen'))}>大神</Radio>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={this.state.type==='laoban'} onChange={()=>(this.handdleChange('type','laoban'))}>老板</Radio>
                        </ListItem>
                        <WhiteSpace/>
                        <Button type='primary' onClick={this.register}>注&nbsp;&nbsp;&nbsp;册</Button>
                        <Button onClick={this.toLogin}>已有用户</Button>
                    </WingBlank>
                </List>
            </div>
        )
    }
}

export default connect(
    state=>({user:state.user}),
    {register}
)(Register)