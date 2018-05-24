### 实现聊天消息列表每个聊天分组中的未读数量的显示
    1.在Message组件中实现静态显示先
    2.动态的实现，定义一个函数getLastMsgs()：函数返回值聊天分组的消息数组
        getLastMsgs(chatMsgs,userid)该函数实现步骤是：
            1). 根据chat_id实现分组 lastMsgObjs = {chat_id1:{},chat_id2:{}......}
                遍历当前用户相关聊天消息的列表chatMsgs,判断当前消息是否在lastMsgObjs这个对象中
                    const chatId = msg.chat_id //当前消息的chat_id
                    const lastMsg = lastMsgObjs[chatId] //从lastMsgObjs中获取chatId的属性值
                判断条件:lastMsg是否有值
                    <1> 不存在：lastMsgObjs[chatId] = msg
                    <2> 已经存在:这是还得比较当前的消息与在lastMsgObjs中的那条lastMsg的create_time，大的放进lastMsgObjs中

                统计每一个分组的消息未读数量：
                    /*  判断是否已读：当前消息是否是 发送给我 的 未读消息  */
                            if(!msg.read && msg.to === userid){
                                msg.unReadCount = 1
                            }else{
                                msg.unReadCount = 0
                            }
                lastMsg是否有当前的分组不存在：unReadCount不做改变
                已经存在时要对unReadCount进行累加，要么原来的加 0 || 1
                    const unReadCount =  lastMsg.unReadCount
                        if (msg.create_time>lastMsg.create_time){//说明msg更新与存在于lastMsgObj对象中的
                            lastMsgObj[chatId] = msg

                    }
                    lastMsgObj[chatId].unReadCount = msg.unReadCount + unReadCount

            2). 生成一个由lastMsgObjs所有属性值组成的数组 lastMsgs
                const lastMsgs = Object.values(lastMsgObj)
            3). 对每个lastMsgs进行排序(降序)，实现最新的消息能在最上头显示
                lastMsgs.sort(function (msg1, msg2) {
                        return msg2.create_time-msg1.create_time
                    })
    3.遍历聊天分组的消息数组，生成显示的列表
        {
            lastMsgs.map(msg=>{
                const targetId = meId===msg.from?msg.to:msg.from
                const headerIcon = users[targetId].header?users[targetId].header:null
                return (<Item
                    extra={<Badge text={msg.unReadCount}/>}
                    thumb={headerIcon}
                    arrow='horizontal'
                    onClick={()=>this.props.history.push(`/chat/${targetId}`)}
                >
                    {msg.content}
                    <Brief>{users[targetId].username}</Brief>
                </Item>)
            })
        }
### 实现底部选项卡中消息未读总数显示
    1.在redux的reducer的chat中管理着unReadCount：num，表示消息未读的总数；用于在底部导航的消息显示
    2.处理unReadCount的统计，在chat reducer函数中
### 查看未读消息修改消息的read状态，更新显示