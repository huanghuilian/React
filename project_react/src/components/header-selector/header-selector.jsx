//该UI组件用于实现 ：大神/老板信息完善界面的头像选择部分  是大神/老板信息完善组件的子组件
import React,{Component} from 'react'
import {Grid,List} from 'antd-mobile'

import PropTypes from 'prop-types'
export default class HeaderSelect extends Component{
    constructor(props){
        super(props);
        this.headerList = []
        for (let i=0;i<20;i++){
            this.headerList.push({
                text:'头像'+(i+1),
                icon:require(`../../assets/images/headers/头像${i+1}.png`)
            })
        }
    }
    static propTypes = {
        setHeader:PropTypes.func.isRequired
    }
    state = {
        icon:null //这是头像图像对象，用于选中头像时显示在List头部
    }
    //处理点击头像的数据  1.设置本组件的状态  2.设置父组件的状态
    handleClick = ({text,icon})=>{
       /* console.log(text,icon)*/
        //设置本组件的状态
        this.setState({icon})
        //设置父组件的状态
        this.props.setHeader(text)
    }
    render(){
        const {icon} = this.state
        //用于实现先选择头像标题的动态显示
        const headerSelect = icon ? (
            <div>您选择的头像是：<img src={icon} alt='头像图片'/></div>
        ):'请选择头像'
        return (
            <List renderHeader={()=>headerSelect}>
                <Grid data={this.headerList} columnNum={5} onClick={this.handleClick}></Grid>
            </List>
        )
    }
}
