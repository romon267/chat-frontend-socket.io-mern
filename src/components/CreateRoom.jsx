import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../reducers/userReducer';
import { createChannel } from '../reducers/channelReducer';

const CreateRoom = () => {
  const [newUsername, setNewUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const titleClassName = 'font-bold text-xl mb-2';
  const inputFieldClass = 'rounded-l shadow-sm border-r-0 border-gray-400 hover:bg-gray-100 hover:border-gray-500';
  const buttonClass = 'focus:ring-2 shadow-sm px-3 py-2 border border-gray-400 hover:border-gray-500 rounded-r font-semibold focus:outline-none hover:bg-gray-200 focus:bg-gray-300';
  const dispatch = useDispatch();
  const user = useSelector((state) => state.activeUser);

  // Creating a new channel and saving to DB
  const handleChannelCreation = (event) => {
    event.preventDefault();
    dispatch(createChannel({ name: roomName, creator: user.username }));
    setRoomName('');
  };

  // Saving a user in a localStorage for use with messages
  const handleUserCreation = (event) => {
    event.preventDefault();
    dispatch(loginUser(newUsername));
    setNewUsername('');
  };

  return (
    <div className="md:grid md:grid-cols-5">
      <div className="mx-3 md:col-start-2 md:col-span-3 rounded shadow-sm border px-5 py-3 mt-5 text-center">
        {
          user
            ? (
              <div>
                Hello,
                {' '}
                {user.username}
                !
                <button
                  type="button"
                  onClick={() => dispatch(logoutUser())}
                  className="px-2 py-1 mx-2 border hover:bg-gray-200 focus:outline-none focus:ring-2 border-gray-400 hover:border-gray-500 rounded shadow-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <h1 className={titleClassName}>
                  Enter your name
                </h1>
                <form onSubmit={handleUserCreation}>
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    value={newUsername}
                    onChange={({ target }) => setNewUsername(target.value)}
                    className={inputFieldClass}
                  />
                  <button
                    type="submit"
                    className={buttonClass}
                  >
                    Set
                  </button>
                </form>
              </div>
            )
        }
        <h2 className={titleClassName}>Create a new room or join existing</h2>
        {
          user
            ? (
              <form onSubmit={handleChannelCreation}>
                <input
                  type="text"
                  placeholder="Enter room name"
                  value={roomName}
                  onChange={({ target }) => setRoomName(target.value)}
                  className={inputFieldClass}
                />
                <button
                  type="submit"
                  className={buttonClass}
                >
                  Create
                </button>
              </form>
            ) : (
              'Login to create and join rooms!'
            )
        }
      </div>
    </div>
  );
};

export default CreateRoom;
