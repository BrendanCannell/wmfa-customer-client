import R from 'ramda'
import {createStore, applyMiddleware} from 'redux'
import {combineReducers} from 'redux'
import {createLogger} from 'redux-logger'
import {createEpicMiddleware, combineEpics} from 'redux-observable'

import * as epics from "./epics"
import * as reducers from "./reducers"

let epicMiddleware = createEpicMiddleware()

  , reducer = (state = {}, action) => Object.values(reducers).reduce((acc, fn) => fn(acc, action), state)

  , store = createStore(reducer, applyMiddleware(epicMiddleware))
  
  // , store = createStore(reducer, applyMiddleware(epicMiddleware, createLogger()))

epicMiddleware.run(combineEpics(...Object.values(epics)))

export default store