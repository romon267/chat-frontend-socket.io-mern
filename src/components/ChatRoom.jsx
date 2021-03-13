import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import useChat from '../hooks/useChat';

// Small element ref at the bottom of chat, so it automatically scrolls to bottom
// when new messages arrive
const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView({ behavior: 'smooth' }));
  return <div ref={elementRef} />;
};

const Message = ({ user, msg }) => {
  // Tailwindcss styles
  const msgOwn = 'bg-green-200 mx-3 mb-3 p-1 rounded w-52 self-end';
  const msgForeign = 'bg-blue-200 ml-3 mb-3 p-1 rounded w-52 self-start';
  const flexOwn = 'flex flex-row-reverse items-baseline space-x-1';
  const flexForeign = 'flex flex-row items-baseline space-x-1';

  // Style depends on message's ownership
  // if current user is creator of message => it shows on the right side and with green bg
  // if message is not user's => it's on the left and of color blue
  return (
    <div className={user.id === msg.author.id ? flexOwn : flexForeign}>
      <span className={
        user.id.toString() === msg.author.id.toString() ? msgOwn : msgForeign
      }
      >
        {msg.content}
      </span>
      <span className="text-gray-300 text-sm self-start">
        {msg.date}
      </span>
      { user.id !== msg.author.id
        ? (
          <>
            <br />
            <span className="text-gray-500 self-start px-2">{msg.author.username}</span>
          </>
        ) : null}
    </div>
  );
};

const ChatRoom = () => {
  const { roomId } = useParams();
  // Getting socket, userlist and message sending function from custom hook
  const {
    sendMessage,
    users,
    callUser,
    answerCall,
    leaveCall,
    callAccepted,
    callEnded,
    idToCall,
    setIdToCall,
    receivingCall,
    myVideo,
    userVideo,
    stream,
    name,
    setName,
    me,
  } = useChat(roomId);
  // Controlling the form
  const [message, setMessage] = useState('');
  // Getting state from redux store
  const user = useSelector((state) => state.activeUser);
  const messages = useSelector((state) => state.channels.messages);
  // Tailwindcss styles
  const inputFieldClass = 'w-5/6 rounded-bl shadow-sm border-r-0 border-t-0 border-gray-400 hover:bg-gray-100 hover:border-gray-500';
  const buttonClass = 'w-1/6 focus:ring-2 shadow-sm px-3 py-2 border border-t-0 border-gray-400 hover:border-gray-500 rounded-br font-semibold focus:outline-none hover:bg-green-200 focus:bg-green-300';

  const handleMessageSend = (event) => {
    event.preventDefault();
    sendMessage(message);
    setMessage('');
  };

  if (!user) {
    console.log('no user');
    return (
      <div className="text-center">
        <h1 className="font-bold text-xl mt-3">Please login to see chat!</h1>
      </div>
    );
  }

  return (
    <div className="md:grid md:grid-cols-5">
      <div className="mx-3 md:col-start-2 md:col-span-3 shadow-sm border rounded px-5 py-3 mt-5 text-center">
        <h1 className="font-bold text-xl mb-2">
          Room:
          {' '}
          #
          {roomId}
        </h1>
        <div className="md:grid md:grid-cols-4">
          <div className="col-span-1 pt-2 col-start-1 bg-blue-100 rounded-t md:rounded-tr-none border border-gray-400">
            <h2 className="font-semibold">
              Users in room:
            </h2>
            <ul>
              {users.map((u) => <li key={u.id}>{u.username}</li>)}
            </ul>
          </div>
          <div className="col-span-3 col-start-2 border border-gray-400 md:rounded-tr pt-2 md:border-l-0">
            <h2 className="font-semibold text-lg">
              Chat
            </h2>
            <div className="h-80 overflow-auto">
              <ul className="flex flex-col items-baseline">
                {
                  messages
                    ? (
                      <>
                        {messages.map((msg) => (
                          <li
                            key={msg.id}
                            className={user.id === msg.author.id ? 'self-end items-baseline' : 'self-start items-baseline'}
                          >
                            <Message user={user} msg={msg} />
                          </li>
                        ))}
                      </>
                    )
                    : ('No messages yet..')
                }
                <AlwaysScrollToBottom />
              </ul>
            </div>
          </div>
          <form className="md:col-span-4" onSubmit={handleMessageSend}>
            <input
              type="text"
              placeholder="Send a message..."
              value={message}
              onChange={({ target }) => setMessage(target.value)}
              className={inputFieldClass}
            />
            <button
              type="submit"
              className={buttonClass}
            >
              Send
            </button>
          </form>
        </div>
      </div>
      <div className="col-span-5">
        <div className="video-container">
          {/* User's own video */}
          <div className="video">
            {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />}
          </div>
          {/* Another user's video */}
          <div className="video">
            {callAccepted && !callEnded
            // eslint-disable-next-line jsx-a11y/media-has-caption
              ? <video playsInline ref={userVideo} autoPlay style={{ width: '300px' }} />
              : null}
          </div>
        </div>
        <div className="myId">
          Set your name here:
          <br />
          <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
          <br />
          Copy your id:
          {' '}
          {me}
          <br />
          Who you want to call by id:
          <br />
          <input
            type="text"
            value={idToCall}
            onChange={({ target }) => setIdToCall(target.value)}
          />
          <br />
          {
            callAccepted && !callEnded
              ? (
                <button
                  type="button"
                  onClick={leaveCall}
                >
                  End Call
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => callUser(idToCall)}
                >
                  Call
                  {' '}
                  {idToCall}
                </button>
              )
          }
        </div>
        <div>
          {
            receivingCall && !callAccepted
              ? (
                <div>
                  <h2>
                    {name}
                    {' '}
                    is calling...
                  </h2>
                  <button
                    type="button"
                    onClick={answerCall}
                  >
                    Answer
                  </button>
                </div>
              ) : null
          }
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  msg: PropTypes.shape({
    author: PropTypes.shape({
      username: PropTypes.string,
      id: PropTypes.string,
    }),
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    id: PropTypes.string,
  }).isRequired,
};

export default ChatRoom;
