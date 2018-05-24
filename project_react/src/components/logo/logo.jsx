//简单显示logo的组件
import React,{Component} from 'react'

import logo from '../../assets/images/logo/logo.png'
import './logo.less'
export default class Logo extends Component{
    render(){
        return (
            <div className="logo-container">
                <img src={logo} className='logo-img' alt='logo图片'/>
            </div>
        )
    }
}