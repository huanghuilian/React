import React,{Component} from 'react'
import {TabBar} from 'antd-mobile'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'


const Item = TabBar.Item

class NavFooter extends Component{
    static propTypes = {
        navList:PropTypes.array.isRequired,
        unReadCount:PropTypes.number.isRequired
    }
    render(){
        let {navList,unReadCount} = this.props
        const path = this.props.location.pathname
        //过滤navList中hide为true的那个nav对象
        navList = navList.filter(nav=> !nav.hide)
        return (
            <TabBar>
                {
                    navList.map(nav=>(
                        <Item key={nav.path}
                              badge={nav.path==='/message'?unReadCount:0}
                              title={nav.text}
                              icon={{uri:require(`./images/${nav.icon}.png`)}}
                              selectedIcon={{uri:require(`./images/${nav.icon}-selected.png`)}}
                              selected={path===nav.path}
                              onPress={()=>{
                                  this.props.history.replace(nav.path)
                              }}
                        />
                    ))
                }
            </TabBar>
        )
    }
}
//将一般组件包装成路由组件，这样一般组件就可以使用路由组件的API
export default withRouter(NavFooter)