import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socketClient from 'socket.io-client';
import Peer from 'simple-peer';
import crypto from 'crypto';
import { getSingleChannel, updateChannelMessages } from '../reducers/channelReducer';

const ENDPOINT = 'http://localhost:3001';

const useChat = (roomId) => {
  // ================ VIDEO CHAT, REDO WITH REDUX ========================
  const [me, setMe] = useState('');
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState('');
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  // =====================================================================
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

    // ============== VIDEO CHAT PART ==============
    // Get the video and audio from user
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((userOwnStream) => {
        setStream(userOwnStream);
        myVideo.current.srcObject = stream;
      });

    // Getting socket id from backend
    socketRef.current.on('socketId', (id) => {
      setMe(id);
    });

    // Setting states on getting user call
    socketRef.current.on('callUser', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    // ==============

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

  // ============= VIDEO CHAT METHODS =============
  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    // Listening for signals and emiting data from it
    peer.on('signal', (data) => {
      socketRef.current.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    // Setting other user video stream
    peer.on('stream', (userStream) => {
      userVideo.current.srcObject = userStream;
    });

    socketRef.current.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (data) => {
      socketRef.current.emit('answerCall', {
        signal: data, to: caller,
      });
    });

    peer.on('stream', (userStream) => {
      userVideo.current.srcObject = userStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };
  // =============

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
    callUser,
    answerCall,
    leaveCall,
    receivingCall,
    callAccepted,
    idToCall,
    setIdToCall,
    callEnded,
    myVideo,
    userVideo,
    connectionRef,
    stream,
    name,
    setName,
    me,
  };
};

export default useChat;
