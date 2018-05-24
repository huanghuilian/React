/*=======用于将axios封装成ajax请求的函数========*/
import axios from 'axios'

export default function ajax(type='GET',url='',param={}) {
    if (type==='GET'){
        let strParam = ''
        if (param){
            Object.keys(param).forEach(key=>{
                strParam += key+'='+param[key]+'&'
            })
            strParam = strParam.substring(0,strParam.length-1)
            url = '?'+strParam
        }
        return axios.get(url)
    } else if (type==='POST'){
        return axios.post(url,param)
    }
}