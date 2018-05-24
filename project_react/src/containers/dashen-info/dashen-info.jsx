//这是大神信息完善的路由组件
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {NavBar,InputItem,TextareaItem,Button} from 'antd-mobile'
import {Redirect} from 'react-router-dom'

import HeaderSelect from '../../components/header-selector/header-selector'
import {updateUser} from '../../redux/actions'

class DashenInfo extends Component{
    state = {
        header:'',//头像信息
        post:'',//求职岗位
        info:''//个人介绍
    }
    //定义一个修改状态的函数
    setHeader = (header)=>{
        //更新状态  该方法在headerSelector中调用
        this.setState({
            header
        })
    }
    //定义大神表单数据的函数
    handdleChange=(name,val)=>{
        //更改状态
        this.setState({
            [name]:val
        })
    }
    //定义保存的方法
    save = ()=>{
        this.props.updateUser(this.state)
    }
    render(){
        //通过 header  状态是否存在来确定是渲染信息完善页面还是渲染对应的主界面
        const {header,type} = this.props.user
        if (header){
            const path = type ==='dashen'?'/dashen':'laoban'
            return <Redirect to={path}/>
        }
        return (
            <div>
                <NavBar>大神信息完善</NavBar>
                <HeaderSelect setHeader={this.setHeader}></HeaderSelect>
                <InputItem placeholder='请输入求职岗位' onChange={(val)=>{this.handdleChange('post',val)}}>求职岗位:</InputItem>
                <TextareaItem title='个人介绍:' rows={3} onChange={(val)=>{this.handdleChange('info',val)}}/>
                <Button type='primary' onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
            </div>
        )
    }
}
export default connect(
    state=>({user:state.user}),
    {updateUser}
)(DashenInfo)
