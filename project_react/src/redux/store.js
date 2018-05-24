//这是一个创建redux 的核心管理对象store 的一个模块

import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import user from './reducers'

export default createStore(user,composeWithDevTools(applyMiddleware(thunk)))