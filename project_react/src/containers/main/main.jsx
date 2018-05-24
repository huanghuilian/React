//主界面的路由组件
import React,{Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {NavBar} from 'antd-mobile'

import LaobanInfo from '../laoban-info/laoban-info'
import DashenInfo from '../dashen-info/dashen-info'
import Dashen from '../dashen/dashen'
import Laoban from '../laoban/laoban'
import Message from '../message/message'
import Personal from '../person/person'
import NotFound from '../../components/not-found/not-found'
import NavFooter from  '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat'

import {getUser} from '../../redux/actions'
import {getRedirect} from '../../utils'

class Main extends Component{
    // 给组件对象添加属性
    navList = [
        {
            path: '/laoban', // 路由路径
            component: Laoban,
            title: '大神列表',
            icon: 'dashen',
            text: '大神',
        },
        {
            path: '/dashen', // 路由路径
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板',
        },
        {
            path: '/message', // 路由路径
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息',
        },
        {
            path: '/personal', // 路由路径
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人',
        }
    ]
    //用于当浏览器cookies中存在userid时并且redux管理中没有_id时获取用户信息
    componentDidMount(){
        const userid = Cookies.get('userid')
        const {_id} = this.props.user
        if (userid && !_id) {
            this.props.getUser()
        }
    }
    render(){
        const pathname = this.props.location.pathname
        const userid = Cookies.get('userid')
        const {user,unReadCount} = this.props
        if (!userid) {
            return <Redirect to='/login'/>
        }
        if (!user._id){
            //console.log('faqingqiu')
            return null //如果cookies中有userid并且redux中没有_id；什么都不显示，首次渲染完成，区后台获取用户信息
        }else {//如果redux中有_id:
            //console.log('1')
            if (pathname === "/") {
                /* 如果访问的是根路径: */
                //console.log(user.type,user.header)
                const path = getRedirect(user.type,user.header)
                return <Redirect to={path}/>
            }
        }

        //当前应该显示的导航项
        const {navList} = this
        const currentnav = navList.find(nav=> nav.path === pathname)
        if(currentnav){
            // 指定哪个nav应该被隐藏 根据用户类型
            if (user.type === 'laoban') {
                navList[1].hide = true
            } else {
                navList[0].hide = true
            }
        }
        return (
            <div>
                {currentnav ? <NavBar className='stick-top'>{currentnav.title}</NavBar>: null}
                <Switch>
                    {navList.map(nav=>(
                        <Route key={nav.path} path={nav.path} component={nav.component}></Route>
                    ))}
                    <Route path='/dasheninfo' component={DashenInfo}></Route>
                    <Route path='/laobaninfo' component={LaobanInfo}></Route>
                    <Route path='/chat/:userid' component={Chat}></Route>

                   {/* <Route path='/dashen' component={Dashen}></Route>
                    <Route path='/laoban' component={Laoban}></Route>
                    <Route path='/message' component={Message}></Route>
                    <Route path='/personal' component={Personal}></Route>*/}
                    <Route component={NotFound}/>
                </Switch>
                {currentnav?<NavFooter navList={navList} unReadCount={unReadCount}/>:null}
            </div>

        )
    }
}
export default connect(
    state=>({user:state.user,unReadCount:state.chat.unReadCount}),
    {getUser}
)(Main)
/* 实现用户免登陆的功能： 条件浏览器cookies中存在userid
*       浏览器cookies中是否存在userid：
*           如果有:
*               看redux中有没有_id
*                   如果有：直接使用
*                   如果没有发送异步请求获取用户信息
*           如果没有：
*               直接重定向到登录界面
* */