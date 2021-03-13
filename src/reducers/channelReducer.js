/* eslint-disable no-case-declarations */
import channelService from '../services/channels';

const channelReducer = (state = [], action) => {
  switch (action.type) {
  case 'CREATE_CHANNEL':
    return [action.data, ...state];
  case 'UPDATE_MESSAGES':
    const updatedChannel = { ...state, messages: [...state.messages, action.data] };
    return updatedChannel;
  case 'UPDATE_CHANNEL':
    const changedChannel = action.data;
    const newState = state.map((c) => (c.id === changedChannel.id ? changedChannel : c));
    return newState;
  case 'GET_SINGLE_CHANNEL':
    return action.data;
  case 'INIT_CHANNELS':
    return action.data;
  default:
    return state;
  }
};

export const getSingleChannel = (id) => async (dispatch) => {
  try {
    const channel = await channelService.getById(id);
    return dispatch({
      type: 'GET_SINGLE_CHANNEL',
      data: channel,
    });
  } catch (err) {
    return console.log('Error fetching single channel', err);
  }
};

export const updateChannelMessages = (newMsg) => ({
  type: 'UPDATE_MESSAGES',
  data: newMsg,
});

export const updateChannel = (id, users) => async (dispatch) => {
  try {
    const updatedChannel = await channelService.updateChannelUsers(id, users);
    return dispatch({
      type: 'UPDATE_CHANNEL',
      data: updatedChannel,
    });
  } catch (err) {
    return console.log('Error updating a channel', err);
  }
};

export const createChannel = (newChannelData) => async (dispatch) => {
  try {
    const savedChannel = await channelService.create(newChannelData);
    return dispatch({
      type: 'CREATE_CHANNEL',
      data: savedChannel,
    });
  } catch (err) {
    return console.log('Error creating a new channel', err);
  }
};

export const initializeChannels = () => async (dispatch) => {
  try {
    const initialChannels = await channelService.getAll();
    dispatch({
      type: 'INIT_CHANNELS',
      data: initialChannels,
    });
  } catch (err) {
    console.log('Error initializing posts', err);
  }
};

export default channelReducer;
