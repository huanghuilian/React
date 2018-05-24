//这是一个多reducer更新state状态的函数集合
import {combineReducers} from 'redux'

import {getRedirect} from '../utils/index'
import {ACK_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER,RECEIVE_USERLIST,RECEIVE_MSG_LIST,RECEIVE_MSG,MSG_READ} from './action-types'
const initUser = {
    username:'',
    msg:'',
    type:'',
    toRedirect:''
}
function user(state = initUser,action) {
    switch (action.type) {
        case ACK_SUCCESS:// 认证成功 action  ：{type user：{_id,username，type}}
            const toRedirect = getRedirect(action.user.type,action.user.header)
            return {...action.user,toRedirect}
        case ERROR_MSG: // 认证失败：1）前端的认证失败  2)发了请求的后台认证失败
            return {...state,msg:action.msg}
        case RECEIVE_USER: //更新用户信息成功后 dashen{_id,username, type,header,post,info} laoban{_id,username,type,header,info,post,company,salary}
            return action.user
        case RESET_USER: //更新用户信息失败后 清除
            return {...initUser,msg:action.msg}
        default:
            return state
    }
}

//处理用户列表的reducer函数
const initUserList = []
function userList(state=initUserList,action) {
    switch (action.type){
        case RECEIVE_USERLIST:
            return action.users
        default:
            return state
    }
}

//当前用户的聊天消息列表的reducer函数
const initChatMsg = {
    users:{},
    chatMsgs:[],
    unReadCount:0
}
function chat(state=initChatMsg,action) {
    switch (action.type){
        case RECEIVE_MSG_LIST:
            const {users,chatMsgs,userid} = action.data
            return {
                users,
                chatMsgs,
                unReadCount:chatMsgs.reduce((preTotal,msg)=>preTotal+(!msg.read&&msg.to===userid?1:0),0)
            }
        case RECEIVE_MSG:
            const {chatMsg} = action.data
            return {
                users:state.users,
                chatMsgs:[...state.chatMsgs,chatMsg],
                unReadCount:state.unReadCount +(!chatMsg.read&&chatMsg.to===action.data.userid?1:0)
            }
        case MSG_READ://要对消息未读总数进行更新  以及chatMsgs中msg的read改为true
            const {count,from,to} = action.data
            return {
                users:state.users,
                chatMsgs: state.chatMsgs.map(msg=>{
                    if (!msg.read && msg.to===to && msg.from===from) { //
                        return {...msg,read:true} //为了不能修改原来的chatMsgs的数据，不能写msg.read=true  return msg
                    }else{
                        return msg
                    }
                }),
                unReadCount: state.unReadCount-count
            }
        default:
            return state
    }
}
export default combineReducers({
    user,
    userList,
    chat
})