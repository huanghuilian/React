/*========用于创建action对象的模块 ==============*/
import {reqRegister,reqLogin} from '../api/index'
import {ACK_SUCCESS,ERROR_MSG} from './action-types'
const ackSuccess = (user)=>({type:ACK_SUCCESS,user})
const errorMsg = (msg)=>({type:ERROR_MSG,msg})
export const register = ({username,password,password2,type})=>{
    if (!username|| !password) {
        return errorMsg('用户名或密码不能为空！！！')
    }else if (password!==password2) {
        return errorMsg('用户名和密码不一致！！！')
    }
    return async dispatch=>{
        const response = await reqRegister({username,password,type})
        const result = response.data
        if (result.code === 0){
            dispatch(ackSuccess(result.data))
        } else if (result.code === 1){
            dispatch(errorMsg(result.msg))
        }
    }
}