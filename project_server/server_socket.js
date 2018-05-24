/*服务端与客户端之间的通信实现实时聊天的功能*/
module.exports = function (server) {
    const ChatModel = require('./models/chat').ChatModel
    //1.引入socket.io包创建  io  对象  socket.io库向外暴露的是一个函数
    const io = require('socket.io')(server)
    //2.为io对象绑定connection监听
    io.on('connection',function (socket) {
        //监听浏览器中的sendMsg消息，接收来自客户端的消息
        socket.on('sendMsg',function ({from,to,content}) {
            //根据from和to拼接chat_id  sort()作用就是使from_to和to_from拼接的结果是一样的；都同属于相同两个人的通信
            const chat_id = [from,to].sort().join('_')
            const create_time = Date.now()
            const chatModel = new ChatModel({from,to,chat_id,create_time,content}).save(function (err, chatMsg) {//chatMsg为保存到集合中的数据
                io.emit('receiveMsg',chatMsg)
            })
        })
    })
}