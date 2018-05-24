/*===================入口文件=======================*/

import React,{Component} from 'react'
import ReactDOM,{render} from 'react-dom'
import {HashRouter,Route,Switch} from 'react-router-dom' //用于路由组件映射成路由所要用到的库
//redux对转态的管理
import {Provider} from 'react-redux'
//引入store对象
import store from './redux/store'
//引入一级路由组件
import Register from './containers/register/register'
import Login from './containers/login/login'
import Main from './containers/main/main'
//1.将路由组件映射成路由

render((
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path='/register' component={Register}></Route>
                <Route path='/login' component={Login}></Route>
                <Route component={Main}></Route>
            </Switch>
        </HashRouter>
    </Provider>
),document.getElementById('root'))