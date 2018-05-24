//这是大神信息完善的路由组件
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {NavBar,InputItem,TextareaItem,Button} from 'antd-mobile'
import {Redirect} from 'react-router-dom'

import HeaderSelect from '../../components/header-selector/header-selector'
import {updateUser} from '../../redux/actions'
class LaobanInfo extends Component{
    state = {
        header: '', // 头像名称
        info: '', // 职位简介
        post: '', // 职位名称
        company: '', // 公司名称
        salary: '' // 工资
    }
    //定义一个修改状态的函数
    setHeader = (header)=>{
        //更新状态  该方法在headerSelector中调用
        this.setState({
            header
        })
    }
    //定义手机表单数据的函数
    handdleChange=(name,val)=>{
        //更改状态
        this.setState({
            [name]:val
        })
    }
    //定义保存的方法
    save = ()=>{ //点击保存按钮调用发送衣异步请求   actions
        this.props.updateUser(this.state)
    }
    render(){
        //通过 header  状态是否存在来确定是渲染信息完善页面还是渲染对应的主界面
        const {header,type} = this.props.user
        console.log(header)
        if (header){
            const path = type ==='dashen'?'/dashen':'laoban'
            return <Redirect to={path}/>
        }
        return (
            <div>
                <NavBar>老板信息完善</NavBar>
                <HeaderSelect setHeader={this.setHeader}></HeaderSelect>
                <InputItem placeholder='请输入招聘职位' onChange={(val)=>{this.handdleChange('post',val)}}>招聘职位:</InputItem>
                <InputItem placeholder='请输入公司名称' onChange={(val)=>{this.handdleChange('company',val)}}>公司名称:</InputItem>
                <InputItem placeholder='请输入职位薪资' onChange={(val)=>{this.handdleChange('salary',val)}}>职位薪资:</InputItem>
                <TextareaItem title='职位要求' rows={3} onChange={(val)=>{this.handdleChange('info',val)}}/>
                <Button type='primary' onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
            </div>
        )
    }
}
export default connect(
    state=>({user:state.user}),
    {updateUser}
)(LaobanInfo)