import axios from 'axios';

const baseUrl = '/api/channels';

// Fetching all channels from server
const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

// Fetch single channel
const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

// Creating a new channel
const create = async (newChannel) => {
  const response = await axios.post(baseUrl, newChannel);
  return response.data;
};

// Updating a channel
const updateChannelUsers = async (id, users) => {
  const response = await axios.patch(`${baseUrl}/${id}`, users);
  return response.data;
};

export default {
  getAll,
  getById,
  create,
  updateChannelUsers,
};
