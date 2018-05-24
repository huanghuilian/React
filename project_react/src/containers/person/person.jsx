import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Result,List,Button,WhiteSpace,Modal} from 'antd-mobile'
import Cookies from 'js-cookie' //用于在退出登录时删除cookies中的userid

import {resetUser} from '../../redux/actions'
const Item = List.Item
const Brief = Item.Brief
const alert = Modal.alert
class Personal extends Component{
    handdleLogout = ()=>{
        alert('退出登录', '你确定要退出登录吗？', [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确定', onPress: () => {
                Cookies.remove('userid')
                    this.props.resetUser()
                } }
        ])
    }
    render(){
        const {username,company,info,salary,post,header} = this.props.user //获取容器组件传递过来的user状态
        return (
            <div style={{marginTop:50}}>
                <Result
                    img={<img src={require(`../../assets/images/headers/${header}.png`)} alt='header'/>}
                    title={username}
                    message={company}
                />
                <List renderHeader={()=>'相关信息'}>
                    <Item multipleLine>
                        <Brief>职位：{post}</Brief>
                        <Brief>简介：{info}</Brief>
                        {salary?<Brief>薪资：{salary}</Brief>:null}
                    </Item>
                </List>
                <WhiteSpace/>
                <Button type='warning' onClick={this.handdleLogout}>退出登录</Button>
            </div>
        )
    }
}
export default connect(
    state=>({user:state.user}),
    {resetUser}
)(Personal)