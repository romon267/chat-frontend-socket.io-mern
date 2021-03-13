const mobileReducer = (state = false, action) => {
  switch (action.type) {
  case 'SET_OPENED':
    return true;
  case 'SET_CLOSED':
    return false;
  default:
    return state;
  }
};

export const openMobileNavbar = () => ({
  type: 'SET_OPENED',
});

export const closeMobileNavbar = () => ({
  type: 'SET_CLOSED',
});

export default mobileReducer;
