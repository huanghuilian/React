// 引入md5加密函数库
const md5 = require('blueimp-md5')
var express = require('express');
var router = express.Router();
// 引入UserModel
const UserModel = require('../models/user').UserModel
//引入ChatModel
const ChatModel = require('../models/chat').ChatModel
const filter = {password: 0,__v:0} // 查询时过滤出指定的属性

/*=================注册路由==================*/
router.post('/register', function (req, res) {
    // 1. 获取请求参数数据(username, password, type)
    const {username, password, type} = req.body
    // 2. 处理数据
    // 3. 返回响应数据
    // 2.1. 根据username查询数据库, 看是否已存在user
    UserModel.findOne({username}, function (err, user) {
        // 3.1. 如果存在, 返回一个提示响应数据: 此用户已存在
        if(user) {
            res.send({code: 1, msg: '此用户已存在'}) // code是数据是否是正常数据的标识
        } else {
            // 2.2. 如果不存在, 将提交的user保存到数据库
            new UserModel({username, password: md5(password), type}).save(function (err, user) {
                // 生成一个cookie(userid: user._id), 并交给浏览器保存
                res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7}) // 持久化cookie, 浏览器会保存在本地文件
                // 3.2. 保存成功, 返回成功的响应数据: user
                res.send({code: 0, data: {_id: user._id, username, type}})  // 返回的数据中不要携带pwd
            })
        }
    })
})
/*====================登陆路由====================*/
router.post('/login', function (req, res) {
    // 1. 获取请求参数数据(username, password)
    const {username, password} = req.body
    // 2. 处理数据: 根据username和password去数据库查询得到user
    UserModel.findOne({username, password: md5(password)}, filter, function (err, user) {
        // 3. 返回响应数据
        // 3.1. 如果user没有值, 返回一个错误的提示: 用户名或密码错误
        if(!user) {
            res.send({code: 1, msg: '用户名或密码错误'})
        } else {
            // 生成一个cookie(userid: user._id), 并交给浏览器保存
            res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
            // 3.2. 如果user有值, 返回user
            res.send({code: 0, data: user}) // user中没有pwd
        }
    })
})
/*=====================更新用户信息==================*/
router.post('/update',function(req,res){//用于用户信息完善保存按钮点击后的响应
    console.log(req.body) //userid 和在信息完善页面中填的数据
    const userid = req.cookies.userid
    if (!userid) {
       return  res.send({code:1,msg:'您还没有登录，返回登录页进行登录'})
    }
    UserModel.findByIdAndUpdate({_id:userid},req.body,function (err,user) {
        //这里的user是数据库中查询到的老的数据
        // 表示数据在数据库中完成了更新，响应数据给客户端
        console.log(user)
        if(!user){ //判断存在cookie中的userid是否有效（可能被修改了）
            res.clearCookie(userid) //通知浏览器端删除cookie
            res.send({code:1,msg:'请先登录'})
        }else{
            const {_id,username,type} = user

            //  req.body 请求参数与 user进行合并
            const userInfo = Object.assign(req.body,{_id,username,type})
            console.log(userInfo)
            res.send({code:0,data:userInfo})
        }

        /*{
  "code": 0,
  "data": {
    "userid": "5ae4449a3c5a0f29d4a3147f",
    "header": "头像1",
    "info": "react/vue/html+css+js",
    "post": "web前端工程师",
    "_id": "5ae40f903c5a0f29d4a3147c",
    "username": "tom",
    "type": "dashen"
  }
} */

    })
})
/*================获取用户信息的路由=================*/
router.get('/user',function (req,res) {
    const userid = req.cookies.userid
    if (!userid) {
        return res.send({code:1,msg:'您还没有登录，返回登录页进行登录'})
    }
    UserModel.findOne({_id:userid},filter,function (err,user) {
        if (!user){
            res.send({code:1,msg:'您还没有登录，返回登录页进行登录'})
        }else{
            res.send({code:0,data:user})
        }
    })
})
/*===============获取大神/老板信息列表===============*/
router.get('/list',function (req,res){
    const {type} = req.query //获取请求参数
    console.log(type)
    UserModel.find({type},filter,function (err, user) {
        console.log(user)
        //return res.json({code:0,data:user})
        res.send({code:0,data:user})
    })
})
/*==============获取当前用户所有相关聊天信息列表===============*/
router.get('/msglist',function (req, res) {
    /**返回值：{code：0，data:{users:{_id:{username,header}},chatMsgs:[]}}*/
    //1.获取cookies中的userid
    const {userid} = req.cookies
    //2.找到users集合中的所有用户文档
    UserModel.find(function (err,usersDoc) {
        console.log(usersDoc)
        let users = {} //对象中的属性名是用户集合中每一个文档的_id 值就是 { username , header }
        usersDoc.forEach(doc=>{
            users[doc._id] = {username:doc.username,header:doc.header}
        })
        console.log(users)
        //3.查找当前用户 ChatModel集合中有通信的记录 {}
        ChatModel.find({'$or':[{from:userid},{to:userid}]},filter,function (err, chatMsgs) {
            res.send({code:0,data:{users,chatMsgs}})
        })
    })
})
/*==============修改用户消息为已读状态===========*/
router.post('/readmsg',function (req, res) {
    //1.获取请求参数
    const from = req.body.from //表示为发送消息的源头
    const to = req.cookies.userid //表示当前请求该路由的用户
    console.log('from====',from,'to=====',to)
    ChatModel.update({from,to,read:false},{read:true},{multi:true},function (err, doc) {
        console.log(doc) //data返回的是一个对象{nModified：被修改的文档条数，nMatched：匹配的数量，nUpserted：}
        res.send({code:0,data:doc.nModified})
    })
})
module.exports = router
