//该模块用于action对象创建
import {
    ACK_SUCCESS, //用户验证成功
    ERROR_MSG, //错误消息
    RECEIVE_USER, //成功获取用户数据
    RESET_USER, //重置用户信息
    RECEIVE_USERLIST, //收到用户列表
    RECEIVE_MSG, //收到聊天消息
    RECEIVE_MSG_LIST, //收到聊天消息的列表
    MSG_READ, //读取了消息
} from './action-types'
import {reqRegister,reqLogin,reqUpdateUser,reqUser,reqUserList,reqChatMsgList,reqReadChatMsg} from '../api/index'
import io from 'socket.io-client'

// 创建一个同步的action{type data}  表示验证成功用于分发给reducer函数进行修改状态
const ackSuccess = (user)=>({type:ACK_SUCCESS,user})
// 创建一个同步的action{type data}  表示验证失败用于分发给reducer函数进行修改状态
const errorMsg = (msg)=>({type:ERROR_MSG,msg})
//创建一个同步action  表示更新用户信息成功分发给reducer函数进行修改状态
const receiveUser = (user)=>({type:RECEIVE_USER,user})
//创建一个同步action  表示更新用户信息失败分发给reducer函数进行修改状态
export const resetUser = (msg)=>({type:RESET_USER,msg})
//创建一个同步action  表示请求用户列表数据分发给reducer函数进行修改状态
const receiveUserList = (users)=>({type:RECEIVE_USERLIST,users})
//获取当前用户聊天消息列表的同步action
const receiveMsgList = ({users,chatMsgs,userid}) =>({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}})
//获取到一条消息的同步action
const receiveMsg = (chatMsg,userid) =>({type:RECEIVE_MSG,data:{chatMsg,userid}})
//消息已读的同步action
const msgRead = ({count,from,to})=>({type:MSG_READ,data:{count,from,to}})

//异步action  注册 data表示注册用户填写的信息
export const register = ({username,password,password2,type})=>{
    //对用户输入的信息进行前端简单正则验证 保证所有的输入都有值，两次输入的密码保持一致
        if (!username || !password ||  !type){//输入的内容中存在没有输入的情况
            return errorMsg('用户名/密码必须输入')
        }
        if(password!==password2){
            return errorMsg('两次输入的密码不一致，请重新输入')
        }
    //如果输入合法 发送ajax请求，最终根据请求结果分发不同的同步action
    return async (dispatch) =>{
        const respond = await reqRegister({username,password,type})//返回的是一个promise对象
        const result = respond.data //返回的数据情况有两种：成功{code：0,msg：data} ; 失败：{code: 1, msg: '此用户已存在'}
        if(result.code === 0){
            getMsgList(dispatch,result.data._id)
             dispatch(ackSuccess(result.data))//分发验证成功的同步action，去调用对应的reducer
        }else if(result.code===1){
             dispatch(errorMsg(result.msg)) //分发验证错误的同步action，去调用对应的reducer
        }
    }
}
//异步action 登录请求
export const login = ({username,password})=>{
    if (!username || !password) {//表示用户名或密码有没有输入的内容，返回错误消息
        //分发错误的action
        return errorMsg('用户名或密码不能为空')
    }
    return async (dispatch)=>{ //发送ajax请求，验证登录信息
        const response = await reqLogin({username,password})
        const result = response.data
        if(result.code === 0){
            getMsgList(dispatch,result.data._id)
            dispatch(ackSuccess(result.data))//分发验证成功的同步action，去调用对应的reducer
        }else if(result.code === 1){
            dispatch(errorMsg(result.msg)) //分发验证错误的同步action，去调用对应的reducer
        }
    }
}
//异步action 用户信息完善提价保存
export const updateUser = (user)=>{
    return async dispatch=>{ //编写提交信息完善页中的信息至后台服务器
        const  response = await reqUpdateUser(user)
        const result = response.data // 请求后返回的响应数据
        if (result.code===0){ //成功更新用户信息
            dispatch(receiveUser(result.data))
        }else if (result.code===1){//更新用户信息失败
            dispatch(resetUser(result.msg))
        }
    }
}
//获取用户信息的异步action
export const getUser = ()=>{
    return async dispatch=>{
        const response = await reqUser()
        const result = response.data
        if (result.code === 0){
            getMsgList(dispatch,result.data._id)
            dispatch(receiveUser(result.data))
        } else if (result.code === 1) {
            dispatch(resetUser(result.msg))
        }
    }
}
//获取用户信息列表的异步action
export  const getUserList = (type)=>{
    return async dispatch=>{
        const response = await reqUserList(type)
        const result = response.data
        if (result.code===0){
            dispatch(receiveUserList(result.data))
        }
    }
}
//发送消息的异步action
export const sendMsg = ({from,to,content})=>{
    return dispatch=>{
        //向服务器发送消息
        io.socket.emit('sendMsg',{from,to,content})
        console.log('浏览器发送了消息',{from,to,content})
    }
}
//初始化socket对象的函数
function initIO(dispatch,userid) {
    //初始化socket对象
    //1.判断socket对象是否存在，没有存在才创建
    if (!io.socket){
        io.socket = io('ws://localhost:4000')
        io.socket.on('receiveMsg',function (chatMsg) { // chatMsg{from,to,chat_id,create_time,content}
            if(userid===chatMsg.from || userid===chatMsg.to){
                //分发同步action
                dispatch(receiveMsg(chatMsg,userid))
                console.log('接收到服务器发送来的消息',chatMsg)
            }

        })
    }
}
//获取当前用户的聊天消息列表的异步action  该函数在完善完页面之后就需要自动调用
async function getMsgList (dispatch,userid){ //dispatch获取到消息列表时候需要修改状态  userid用来统计消息未读的总数的
    initIO(dispatch,userid)
    //异步获取聊天的消息列表
    const response = await reqChatMsgList()
    const result = response.data
    if (result.code===0){ //成功获取聊天的消息列表  分发一个receiveMsgList  action
        const {users,chatMsgs}=result.data
        dispatch(receiveMsgList({users,chatMsgs,userid})) //  result.data  是一个{users{}，chatMsgs[] }
    }
}
//消息查看的异步action
export const readMsg = ({from,to})=>{
    return async dispatch=>{
        const response = await reqReadChatMsg(from)
        const result = response.data
        if (result.code===0){
            const count = result.data
            dispatch(msgRead({count,from,to}))
        }
    }
}
