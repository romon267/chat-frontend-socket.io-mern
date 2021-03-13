import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import CreateRoom from './components/CreateRoom';
import ChannelList from './components/ChannelList';
import Navbar from './components/Navbar';
import NotFound from './components/NotFound';
import { initializeUser } from './reducers/userReducer';

const App = () => {
  const dispatch = useDispatch();

  // Getting the logged in user
  useEffect(() => {
    dispatch(initializeUser());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/channels/all" component={ChannelList} />
        <Route path="/channels/:roomId">
          <ChatRoom />
        </Route>
        <Route exact path="/new-channel" component={CreateRoom} />
        <Route exact path="/">
          <Redirect to="/new-channel" />
        </Route>
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
};

export default App;
