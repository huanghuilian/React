//该模块用于定义action对象的type属性

/*===== 表示登录请求 注册请求 的执行reducer行为的表示======*/
// 表示验证成功
export const ACK_SUCCESS = 'ack_success'
//表示请求出错
export const ERROR_MSG = 'error_msg'
//表示更新用户成功
export const RECEIVE_USER = 'receive_user'
//表示更新用户信息失败
export const RESET_USER = 'reset_user'
//表示请求用户列表的信息
export const RECEIVE_USERLIST = 'receive_userlist'
//收到用户消息
export const RECEIVE_MSG = 'receive_msg'
//收到消息列表
export const RECEIVE_MSG_LIST = 'receive_msg_list'
//读取消息
export const MSG_READ = 'msg_read'