import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { initializeChannels } from '../reducers/channelReducer';

const ChannelList = () => {
  const channels = useSelector((state) => state.channels);
  const dispatch = useDispatch();

  // On page load getting list of channels from server
  useEffect(() => {
    dispatch(initializeChannels());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redux state can be array of channels or a single channel and here we need a single channel
  if (!Array.isArray(channels)) {
    return ('loading...');
  }

  return (
    <div className="md:grid md:grid-cols-5">
      <div className="mx-3 md:col-start-2 md:col-span-3 shadow-sm border rounded px-5 py-3 mt-5 text-center">
        <h2 className="font-bold text-xl mb-2">
          List of channels available
        </h2>
        {
          channels
            ? (
              <ul>
                {channels.map((c) => (
                  <Link key={c.id} to={`/channels/${c.id}`}>
                    <li className="border-gray-400 hover:border-gray-600 font-semibold border-2 rounded shadow-sm p-5 mb-3 bg-gray-50 hover:bg-gray-200">
                      {c.name}
                    </li>
                  </Link>
                ))}
              </ul>
            ) : (
              'Loading...'
            )
        }
      </div>
    </div>
  );
};

export default ChannelList;
