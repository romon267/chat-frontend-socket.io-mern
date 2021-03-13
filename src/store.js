import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer';
import channelReducer from './reducers/channelReducer';
import mobileReducer from './reducers/mobileReducer';

const reducer = combineReducers({
  activeUser: userReducer,
  channels: channelReducer,
  mobileNavOpened: mobileReducer,
});

const store = createStore(reducer,
  composeWithDevTools(applyMiddleware(thunk)));

export default store;
