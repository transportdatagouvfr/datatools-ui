import { combineReducers } from 'redux'

import filter from './filter'
import feed from './feed'
import patterns from './patterns'
import routes from './routes'
import stops from './stops'

export default combineReducers({
  filter,
  feed,
  patterns,
  routes,
  stops
})
