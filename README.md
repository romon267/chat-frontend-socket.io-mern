# Chat frontend part

This is my first project with real-time technologies and socket.io.
I made the frontend with react and redux, used axios for sending requests to the backend.
For react i used 'react-router-dom' and 'react-redux', for redux - 'redux-thunk'.

## About app/flow
A user opens a website, then he must provide a name to use. The name is stored in local storage and this
system is used like 'pseudo authentication'.
After creating a username, user can create a new channel or join existing ones in the 'All channels' tab.
When user joins a channel he can write messages to chat.
On the left is list of users currently connected to the channel.
When user closes page and disconnects, he is removed from users list in channel.
Chat shows all the messages written in that channel, because channel is stored in the database and
messages are loaded from database on page load.
Also website is responsive and I made all styling with Tailwindcss.

## Videochat
I tried making a videochat with webRTC and 'simple-peer', but was unsuccessful due to technical issues.
The code i wrote is in 'videochat' branch.


### Running on https://protected-spire-61732.herokuapp.com/new-channel
