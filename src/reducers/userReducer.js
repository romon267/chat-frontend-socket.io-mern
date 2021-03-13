import crypto from 'crypto';

const userReducer = (state = null, action) => {
  switch (action.type) {
  case 'INIT_USER':
    return action.data.user;
  case 'LOGIN_USER':
    return action.data.user;
  case 'REMOVE_USER':
    return null;
  default:
    return state;
  }
};

export const loginUser = (username) => {
  const id = crypto.randomBytes(12).toString('hex');
  const user = { username, id };
  window.localStorage.setItem('chatAppUser', JSON.stringify(user));
  return {
    type: 'LOGIN_USER',
    data: {
      user,
    },
  };
};

export const logoutUser = () => {
  window.localStorage.removeItem('chatAppUser');
  console.log('logged out');
  return {
    type: 'REMOVE_USER',
  };
};

export const initializeUser = () => {
  const loggedInUser = window.localStorage.getItem('chatAppUser');
  console.log('to parse:', loggedInUser);
  let parsedUser;
  if (loggedInUser) {
    parsedUser = JSON.parse(loggedInUser);
    console.log('Found logged in user:', parsedUser);
  }
  return {
    type: 'INIT_USER',
    data: {
      user: parsedUser || null,
    },
  };
};

export default userReducer;
