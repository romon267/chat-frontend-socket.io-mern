import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socketClient from 'socket.io-client';
import crypto from 'crypto';
import { getSingleChannel, updateChannelMessages } from '../reducers/channelReducer';

const ENDPOINT = 'http://localhost:3001';

const useChat = (roomId) => {
  const [users, setUsers] = useState([]);
  const socketRef = useRef();
  const user = useSelector((state) => state.activeUser);
  const dispatch = useDispatch();
  console.log('in hook users', users);

  useEffect(() => {
    if (!user) {
      console.log('useHook no user found');
      return null;
    }

    // Fetch messages from database on load
    dispatch(getSingleChannel(roomId));
    // Create new socket connection
    socketRef.current = socketClient(ENDPOINT, {
      query: { roomId, user },
    });
    console.log('in use hook');
    console.log('emit', user);
    socketRef.current.emit('userJoinRoom', user);

    // Listen for incoming messages
    socketRef.current.on('newChatMessage', (message) => {
      console.log('GETTING NEW MESSAGE', message);
      dispatch(updateChannelMessages(message));
    });

    // On joining room users in room array adjusted
    socketRef.current.on('userJoinRoom', (newUser) => {
      console.log('joining room is usehook');
      setUsers((oldUsers) => {
        if (oldUsers.some((u) => u.id === newUser.id)) {
          return [...oldUsers];
        }
        return [...oldUsers, newUser];
      });
    });

    // On user list changes in backend
    socketRef.current.on('roomListChange', (room) => {
      console.log('room list change happened');
      setUsers(() => {
        console.log(room);
        return room.users;
      });
    });

    // On leaving room users array adjusted accordingly
    socketRef.current.on('userLeaveRoom', (leftUser) => {
      setUsers((oldUsers) => {
        console.log('Old USERS', oldUsers);
        console.log('LEFT USER', leftUser);
        const newUsers = oldUsers.filter((oldUser) => oldUser.id !== leftUser.id);
        return newUsers;
      });
    });

    // Destroy socket ref when connection is closed
    return () => socketRef.current.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, user]);

  // Send a message to the server
  // that forwards it to all users in a room
  const sendMessage = (messageContent) => {
    const options = {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    };
    socketRef.current.emit('newChatMessageToServer', {
      content: messageContent,
      author: { username: user.username, id: user.id },
      date: new Date().toLocaleDateString('ru-RU', options),
      id: crypto.randomBytes(12).toString('hex'),
    });
  };

  return {
    sendMessage,
    users,
    socketRef,
  };
};

export default useChat;
