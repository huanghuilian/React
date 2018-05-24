//包含n个工具函数的模块
/* 总之getRedirect()函数实现的是：当用户登录或者注册成功时的跳转路径设置
    如果用户为大神：已经设置过头像----》直接跳转到大神的主界面  /dashen
                    未设置过头像------》跳转到大神的信息完善页  /dasheninfo
    如果用户为老板：已经设置过头像----》直接跳转到老板的主界面  /laoban
                    未设置过头像------》跳转到老板的信息完善页  /laobaninfo
用户在完成登录/注册成功之后，会跳转到一个指定的页面；
    1.由于用户的类型有：老板  大神  所以信息完善功能所要跳转的页面是不一样的
        是否设置过用户完善信息可以通过 header头像心里来判断 (因为在数据库中将head设置为必须的)
    2.该模块实现的是：
        根据用户类型，设置对应的toRedirect(在reducer中操作的一个状态)路径地址
        由于头像的设置是可选的
    3.此模块暴露的方法在哪里调用：
        1) 在user(reducer函数中)在case为请求成功的情况下，这时候action对象中的第二个参数存在type值
* */
export function getRedirect(type,header) {
    //type表示用户的类型：dashen/laoban
    let path = ''
    path = type==='dashen'?'/dashen':'/laoban'
    if (!header){
        path += 'info'
    }
    return path
}