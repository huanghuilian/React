//该模块用于定义n个发送请求的函数集合

import ajax from './ajax'

//注册路由额请求
export const reqRegister = (user)=> ajax('POST','/register',user)

//登录请求
export const reqLogin = (user) => ajax('POST','/login',user)

//更新用户信息
export const reqUpdateUser = (user) =>ajax('POST','/update',user)

//获取用户信息
export const reqUser = () =>ajax('GET','/user')

//获取大神/老板主界面列表
export const reqUserList = (type)=>ajax('GET','/list',{type})
//获取当前用户的聊天记录
export const reqChatMsgList = ()=>ajax('GET','/msglist')
//修改当前用户的未读消息
export const reqReadChatMsg = (from)=>ajax('POST','/readmsg',{from})
