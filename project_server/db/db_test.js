const md5 = require('blueimp-md5')
/* 1.连接数据库*/
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/db_test')
mongoose.connection.on('connected',function () {
    console.log('数据库连接成功了')
})
//2. 创建Model
const userSchema = mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    type:{type:String,required:true}
})
const UserModel = mongoose.model('user',userSchema)

//操作数据库  新增
function testSave() {
    const userModel = new UserModel({
        username:'jack',
        password:md5('456'),
        type:'dashen'
    })
    userModel.save(function (err,user) {
        console.log('save()',err,user)
    })
}
testSave()
//查询
function testFind() {
    //查询结果为[]  如果没有匹配的返回空数组
    UserModel.find({username:'tom'},function (err,users) {
        console.log('find()',err,users)
    })
    //查询结果为匹配的文档对象  如果没有返回null
    UserModel.findOne({type:'dashen'},function (err,user) {
        console.log('findone()',err,user)
    })
}
testFind()
//更新操作
function testUpdate() {
    UserModel.findByIdAndUpdate({_id:'5ae3dd6b86433b20fcc5c945'},{username:'Tom'},function (err,oldUser) {
        console.log('findByIdAndUpdate()',err,oldUser)
    })
}
testUpdate()
//删除操作
function testDelete() {
    UserModel.remove({username:'jane'},function (err, message) {
        console.log('remove()',err,message)//null { ok: 1, n: 2 }
    })
}
testDelete()
