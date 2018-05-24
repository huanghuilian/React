/* 项目的入口文件
* */
import React from 'react'
import {render} from 'react-dom'
import {HashRouter,Switch,Route} from 'react-router-dom' //引入映射路由组件成路由的组件
import {Provider} from 'react-redux'

//引入路由组件
import Login from './containers/login/login'
import Register from './containers/register/register'
import Main from './containers/main/main'

import store from './redux/store'//管理组件转态的核心对象
//引入错误信息提醒的样式
import './assets/css/index.less'
//import './socketio_test/socket_test'
render((
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login}></Route>
                <Route path='/register' component={Register}></Route>
                <Route component={Main}></Route>
            </Switch>
        </HashRouter>
    </Provider>
),document.getElementById('root'))