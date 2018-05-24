import React,{Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'

const Item = List.Item
const Brief =Item.Brief
//getLastMsgs()该函数实现的是：1. 分组得到一个所有聊天对象最新消息对象组成的一个数组
// 2.在1实现之后，对每个消息对象进行排序(降序)，实现最新的消息能在最上头显示
function getLastMsgs(chatMsgs,userid) {
    //1.创建一个空对象
    let lastMsgObj = {} //{chatId:{}}
    //2.遍历当前用户相关聊天消息的列表
    chatMsgs.forEach(msg=>{
        /*  判断是否已读：当前消息是否是 发送给我 的 未读消息  */
        if(!msg.read && msg.to === userid){
            msg.unReadCount = 1
        }else{
            msg.unReadCount = 0
        }
        const chatId = msg.chat_id
        const lastMsg = lastMsgObj[chatId]
        if (!lastMsg) {//如果在lastMsgObj还没有存储该聊天对象的消息
            lastMsgObj[chatId] = msg //用当前的消息对象的chat_id为属性名，存进lastMsgObj对象中
        }else{//如果在lastMsgObj中已经存在与该聊天对象的消息:这时候得通过创建的时间来决定新的还是旧的放进lastMsgObj中
           const unReadCount =  lastMsg.unReadCount
            if (msg.create_time>lastMsg.create_time){//说明msg更新与存在于lastMsgObj对象中的
                lastMsgObj[chatId] = msg

            }
            lastMsgObj[chatId].unReadCount = msg.unReadCount + unReadCount
            /*if (!msg.read&&msg.to ===userid) {//如果成立：说明是发给我的还未读的消息
                 msg.unReadCount++
            }*/
        }
    })
    const lastMsgs = Object.values(lastMsgObj)
    lastMsgs.sort(function (msg1, msg2) {
        return msg2.create_time-msg1.create_time
    })
    return lastMsgs
}

class Message extends Component{

    render(){
        const {user} = this.props
        const {users,chatMsgs} = this.props.chat
        const meId = user._id
        const lastMsgs = getLastMsgs(chatMsgs,meId)
        return (
            <List style={{marginTop:50,marginBottom:50}}>
                {
                    lastMsgs.map(msg=>{
                        const targetId = meId===msg.from?msg.to:msg.from
                        const headerIcon = users[targetId].header?users[targetId].header:null
                        return (<Item
                            key={msg._id}
                            extra={<Badge text={msg.unReadCount}/>}
                            thumb={require(`../../assets/images/headers/${headerIcon}.png`)}
                            arrow='horizontal'
                            onClick={()=>this.props.history.push(`/chat/${targetId}`)}
                        >
                            {msg.content}
                            <Brief>{users[targetId].username}</Brief>
                        </Item>)
                    })
                }
            </List>
        )
    }
}
export default connect(
    state=>({user:state.user,chat:state.chat})
)(Message)