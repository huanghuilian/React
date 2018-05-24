/*==================创建redux核心管理模块 store==================*/
import React from 'react'
import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import combineComponent from './reducers'

export default createStore(combineComponent,composeWithDevTools(applyMiddleware(thunk)))
