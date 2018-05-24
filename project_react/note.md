### 后台接口的实现：
    1.用于获取当前用户的所有聊天消息
    2.修改当前用户未读消息
### 前台
    #### 编写步骤流程：
        1.在容器组件的文件夹下创建chat--->chat.jsx文件；是一个聊天的组件，当点击用户列表中的某一项的时候应该要跳转到的路由组件
        2.在main.jsx文件中，注册Chat路由，<Route path='/chat/:userid' component={Chat}></Route>
        3.在UserList组件中实现点击跳转到聊天组件：
            绑定单击事件：this.props.history.push(`/chat/${user._id}`)
        4.实现静态的聊天组件
        5.初步实现发送按钮发送消息
            Chat组件：
                1）为'发送'按钮绑定单击事件 ： handleSend
                2）收集输入框中输入的数据
                3）handleSend回调函数的定义
                    发消息前：准备将要发送消息的数据 {from:发送者的userid ，to:收消息用户的_id ， content：发送的内容 }
                    发消息：如果发送的消息不为空，向服务器发送消息；这个实现的函数得在redux中actions中定义一个发消息的异步action
                    发消息后：更新state中content为'' 清空输入框中的内容 value={this.state.content}

             actions文件中：
                1.定义一个发消息的异步action
                2.初始化IO：使socket对象是单例对象，将其存在io对象中
                    怎样使socket对象在整个应用中只创建一次？
                        创建前：判断socket是否存在，只有在不存在的情况下创建socket对象
                        创建后：将socket对象存起来，存在io对象中，这样变成当前模块全局对象
                3.向服务器发送消息: io.socket.emit('sendMsg',{from,to,content})

          后台服务器：
                4.编写服务器通信的代码，接收客户端发送的消息，处理数据，发送消息
                    1) 引入socket.io包创建  io  对象
                    2) 为io对象绑定connection监听，当有客户端连接本服务器时，就会调用该回调，传递一个socket连接对象
                    3) 监听浏览器中的sendMsg消息，接收来自客户端的消息 {from,to,content}
                    4) 处理数据，准备数据，最后保存到数据库中  chats集合中每个文档的结构 {from,to,chat_id,content,read,create_time}
                        chat_id : [from,to].sort().join('_')
                            根据from和to拼接chat_id  sort()作用就是使from_to和to_from拼接的结果是一样的；都同属于相同两个人的通信
                        create_time : Date.now()
                        保存数据，发送消息：
                        const chatModel = new ChatModel({from,to,chat_id,create_time,content}).save(function (err, chatMsg) {//chatMsg为保存到集合中的数据
                                        io.emit('receiveMessage',chatMsg)
                                    })
### 下午实现当前用户与某一个用户聊天的消息列表显示，以及发送的消息实时显示，表情
    #### 前台三部分编写过程：api>index.js  redux  组件
        1. api>index.js ：
            获取当前用户的聊天记录：export const reqChatMsgList = ()=>ajax('GET','/msglist')
            修改当前用户的未读消息：export const reqReadChatMsg = (from)=>ajax('POST','/readmsg',{from})

        2. redux：因为要对新的状态进行管理，所以可以先从reducer中开始
            1) reducers文件中重新定义一个函数来管理消息列表的函数
                初始化管理的状态state = initChatMsg = {
                    users：{},
                    chatMsgs:[],
                    unReadCount:0
                }
            2) action-types文件中定义action的类型：RECEIVE_MSG_LIST(收到消息列表)  RECEIVE_MSG(收到一条消息)
            3) 根据type定义对应的同步action： receiveMsgList = ({users,chatMsgs})=>({type:RECEIVE_MSG_LIST,data:{users,chatMsgs}})
            4) actions文件中编写获取的当前用户消息列表的异步async函数(注：不是异步action) ： getMsgList(dispatch,userid)
                * getMsgList()函数调用时机：I.登录成功时分发action之前  II.注册成功时分发action之前 III. 获取用户信息成功时(自动登录)
                * getMsgList()函数中需要调用api>index.js>reqChatMsgList() 获取当前用户所有相关的消息列表
                        返回的数据：{code：0，data：{users：{userid:{username,header}}，chatMsgs[{},{}]}}
                *当请求成功的时候：分发receiveMsgList同步action  dispatch(receiveMsgList(result.data))

        3.组件中的编写: 完成当前用户与指定聊天对象的消息列表显示
            1) 在包装UI组件为容器组件的connect函数中，添加一个一般属性chat，最终：state=>({user:state.user,chat:state.chat})
            2) render函数中先获取到容器组件传递过来的一般属性，包括：
                                    user(当前用户的信息)     users(所用的用户的username和header信息)   chatMsgs (与当前用户相关的聊天的消息列表)
            3) chatMsgs是所有与当前用户聊过的消息列表，存在的聊天对象是所有，但是现在在Chat组件中要显示的是从用户列表点击的那个聊天对象
                所以可以用chat_id为条件对chatMsgs进行过滤，筛选出需要显示的msgs
            4) 遍历msgs ,依据msg:{from,to,chat_id.....}中的 from 或者 to  的值分别生成 发送方(右侧显示) 和 接收方(左侧显示)的组件标签
                {msgs.map(msg=>{
                        if (msg.from===targetId) {
                            <Item thumb={require('../../assets/images/headers/头像1.png')}>你好</Item>
                        }else{
                            <Item className='chat-me'  extra='我' >很好</Item>
                        }
                })}
            5)获取当前用户聊天对象的头像图片名 由于有的用户信息可能还未完善，所以在获取时先判断header是否存在,
                这时候如果刷新当前的聊天界面，由于chat中初始化状态都是为空的，所以在显示之前判断users[MeId]是否已经有值了
                if (!users[MeId] ){ //过滤之前
                            return null
                }
                if(header){ //由于用户信息存在未完善情况，没有header
                            header = require(`../../assets/images/headers/${header}.png`)
                }
        4.写redux中的actions中，initIO()函数中接收到服务器端的消息的处理；
            1)      io.socket.on('receiveMsg',function (chatMsg) { // chatMsg{from,to,chat_id,create_time,content}
                          if(userid===chatMsg.from || userid===chatMsg.to){
                              //分发同步action
                              dispatch(receiveMsg(chatMsg))
                          }
            2) reducers中编写，实现发送消息立马就能看到显示：
                case RECEIVE_MSG:
                            return {
                                users:state.users,
                                chatMsgs:[...state.chatMsgs,action.data],
                                unReadCount:0
                            }
        #### 表情的功能
            1.使用Grid网格组件一屏显示 8 列 4行的表情列表,超出时可手动滑屏
                <Grid
                    data={this.emojis} //表情的数据emojis是一个数组[{text:''}] 在首屏渲染之情进行定义
                    columnNum={8}
                    carouselMaxRow={4}
                    isCarousel={true}
                    onClick={(item) => {
                        this.setState({content: this.state.content + item.text}) //选中表情往输入框中添加，是在原来的输入的内容中累加
                    }}
                />
                componentWillMount(){//在首次render之前回调
                        this.emojis = ['❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤',
                            '❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤',
                            '❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤',
                            '❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤',
                            '❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤',
                            '❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤']
                        this.emojis = this.emojis.map(emoji=>({text:emoji}))
                    }
            2.Chat组件的发送标签添加一个兄弟span标签，绑定切换表情网格列表显示隐藏的事件
                // 切换表情列表的显示
                    toggleShow = () => {
                        const isShow = !this.state.isShow
                        this.setState({isShow})
                        if(isShow) {
                            // 异步手动派发resize事件,解决表情列表显示的bug: 一点表情要让它显示的时候初次显示不出来
                            setTimeout(() => {
                                window.dispatchEvent(new Event('resize'))
                            }, 0)
                        }
                    }
    #### 列表自动滑动到页面的底部：
             * 当消息超过视口高度时，一进入聊天页，滚动条自动滚动到底部
             *消息列表的高度超过视口高度时，滚动条自动滚到底部，可显示最新发送的消息
             componentDidMount() {
                // 初始显示列表,当消息超过视口高度时，一进入聊天页，滚动条自动滚动到底部
                window.scrollTo(0, document.body.scrollHeight)
            }
            componentDidUpdate () {
                // 更新显示列表，消息列表的高度超过视口高度时，滚动条自动滚到底部，可显示最新发送的消息
                window.scrollTo(0, document.body.scrollHeight)
            }