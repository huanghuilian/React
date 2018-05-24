/*该容器组件用于实现聊天界面*/
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, List, InputItem,Icon,Grid} from 'antd-mobile'

import {sendMsg,readMsg} from '../../redux/actions'

const Item = List.Item
class Chat extends Component{
    state = {
        content:'',
        isShow:false //是否显示表情的标志
    }
    handleSend = ()=>{ //处理发送消息按钮的事件
        //1.准备发送消息的数据
        const from = this.props.user._id //当前用户“我”的id
        const to = this.props.match.params.userid //从路由跳转时传递的params参数
        const content = this.state.content.trim() //发送消息的内容
        if (content){
            //发送消息
                this.props.sendMsg({from,to,content})
            //更新state中content为'' 清空输入框中的内容 value={this.state.content}
            this.setState({content:'',isShow:false})
        }
    }
    componentWillMount(){//在首次render之前回调
        this.emojis = ['❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤',
            '❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤',
            '❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤',
            '❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤',
            '❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤',
            '❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤','❤']
        this.emojis = this.emojis.map(emoji=>({text:emoji}))
    }
    componentDidMount() {
        // 初始显示列表,当消息超过视口高度时，一进入聊天页，滚动条自动滚动到底部
        window.scrollTo(0, document.body.scrollHeight)
    }
    componentDidUpdate () {
        // 更新显示列表，消息列表的高度超过视口高度时，滚动条自动滚到底部，可显示最新发送的消息
        window.scrollTo(0, document.body.scrollHeight)
    }
    componentWillUnmount(){
        //发送异步请求修改已读状态 readMsg({from,to})
        const from = this.props.match.params.userid
        const to = this.props.user._id
        this.props.readMsg({from,to})
    }
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
    render(){
        const {user} = this.props
        const {users,chatMsgs} = this.props.chat
        const MeId = user._id
        const targetId = this.props.match.params.userid
        const me_chatId = [MeId,targetId].sort().join('_') //拼接生成一个chat_id
        if (!users[MeId]){
            return null
        }
        const msgs = chatMsgs.filter( msg => msg.chat_id===me_chatId) //过滤与当前用户相关的消息列表，返回最终要显示的消息
        //console.log(msgs,chatMsgs,me_chatId,targetId,MeId)
        //获取当前用户聊天对象的头像图片名 由于有的用户信息可能还未完善，所以在获取时先判断header是否存在
        //如果刷新当前的聊天界面，由于chat中初始化状态都是为空的，所以在显示之前判断MeId是否已经有值了
        let header = users[targetId].header

        if(header){ //由于用户信息存在未完善情况，没有header
            header = require(`../../assets/images/headers/${header}.png`)
        }
        return (
            <div id='chat-page'>
                <NavBar className='stick-top'
                        icon={<Icon type='left'></Icon>}
                        onLeftClick = {()=>this.props.history.goBack()}
                >
                    {users[targetId].username}
                </NavBar>
                <List style={{marginTop: 50,marginBottom:50}}>
                    {msgs.map(msg=>{
                        if (msg.from===targetId) {
                            return (<Item thumb={header} key={msg._id}>{msg.content}</Item>)
                        }else{
                            return (<Item key={msg._id} className='chat-me'  extra='我'>{msg.content}</Item>)
                        }
                    })}
                </List>

                <div className='am-tab-bar'>
                    <InputItem
                        onChange={val=>this.setState({content:val})}
                        onFocus={()=>this.setState({isShow:false})}
                        value={this.state.content}
                        placeholder="请输入"
                        extra={
                            <span>
                                <span onClick={this.toggleShow}>❤</span>
                                <span onClick={this.handleSend}>发送</span>
                            </span>
                        }
                    />
                    {this.state.isShow?(
                        <Grid
                            data={this.emojis}
                            columnNum={8}
                            carouselMaxRow={4}
                            isCarousel={true}
                            onClick={(item) => {
                                this.setState({content: this.state.content + item.text}) //选中表情往输入框中添加
                            }}
                        />
                    ):null}
                </div>
            </div>
        )
    }
}
export default connect(
    state=>({user:state.user,chat:state.chat}),
    {sendMsg,readMsg}
)(Chat)