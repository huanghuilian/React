import {combineReducers} from 'redux'
import {ACK_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER} from './action-types'

import {getRedirect} from '../utils' //用于用户登录/注册后路由跳转路径的获取 需要传两个参数 type header
const initUser = {
    username:'',
    type:'',
    msg:'',
    toRedirect:''
}
function user(state=initUser,action) {
    switch (action.type){
        case ACK_SUCCESS:
        {const {type,header}=action.user
            return {...action.user,toRedirect:getRedirect(type,header)}}
        case ERROR_MSG:
            return {...state,msg:action.msg}
        case RECEIVE_USER: //更新用户信息成功后 dashen{_id,username, type,header,post,info} laoban{_id,username,type,header,info,post,company,salary}
            return action.user
        case RESET_USER: //更新用户信息失败后 清除
            return {...initUser,msg:action.msg}
        default:
            return state
    }
}
export default combineReducers({
    user
})