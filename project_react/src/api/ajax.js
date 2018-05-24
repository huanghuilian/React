/*该模块用于实现：使用axios封装ajax请求函数 */
/*  发请求，请求方式，请求参数，请求的url
*   type :表示请求方式
*   url：表示请求的url地址
*   param：表示请求参数
* */
import axios from 'axios'
 export default function ajax( type='GET',url='',param={} ) {
    if ( type === 'GET'){
        var qstr = '?'
        if (param) {
            //拼接查询字符型  Object.keys(param)  返回param对象中的所有属性集合的数组
            Object.keys(param).forEach((key,index)=>{
                qstr += key+'='+param[key]+'&'
                console.log(qstr)
            })
           // url += qstr.substring(0,qstr.lastIndexOf('&'))
            url += qstr.substring(0,qstr.length-1)
            console.log(url)
        }

        return axios.get(url)
    } else if ( type === 'POST'){
            return axios.post(url,param)
    }
}
/*
ajax('GET','http://localhost:3000/regist',{username:'hhl',password:'123'})*/
