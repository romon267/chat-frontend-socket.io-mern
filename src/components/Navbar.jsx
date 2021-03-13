import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logoutUser } from '../reducers/userReducer';
import { openMobileNavbar, closeMobileNavbar } from '../reducers/mobileReducer';

const navLink = 'text-white px-2 hover:text-yellow-100 text-m';
const navLinkMobile = 'text-white hover:text-yellow-600 min-w-full hover:bg-gray-100 hover:opacity-50 block px-3 py-2 rounded-md text-base font-medium';

const MenuMobileButton = () => {
  const dispatch = useDispatch();
  const opened = useSelector((state) => state.mobileNavOpened);
  console.log('OPEND:', opened);
  const handleOpened = () => {
    if (opened) {
      return dispatch(closeMobileNavbar());
    }
    return dispatch(openMobileNavbar());
  };

  return (
    <div className="-mr-2 flex justify-end items-end md:hidden">
      {/* <!-- Mobile menu button --> */}
      <button
        type="button"
        className="bg-green-300 mb-2 inline-flex items-end justify-end p-2 rounded-md text-gray-400 hover:text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        aria-controls="mobile-menu"
        onClick={handleOpened}
      >
        {
          opened
            ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="currentColor" className="block h-6 w-6" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )
        }
      </button>
    </div>
  );
};

const MobileNavbar = () => {
  const user = useSelector((state) => state.activeUser);
  const dispatch = useDispatch();
  const opened = useSelector((state) => state.mobileNavOpened);

  return (
    <div className="px-5">
      <MenuMobileButton />
      <div className="flex flex-wrap text-center mx-auto justify-items-center space-y-1">
        {
          opened
            ? (
              <>
                <NavLink to="/new-channel" activeClassName="font-bold" className={navLinkMobile}>New channel</NavLink>
                {/* Conditionally rendering the link to login */}
                {
                  user
                    ? (
                      <>
                        <NavLink to="/channels/all" activeClassName="font-bold" className={navLinkMobile}>All channels</NavLink>
                        <div className="flex justify-items-end items-end">
                          <button
                            type="button"
                            onClick={() => dispatch(logoutUser())}
                            className=" text-right px-3 inline-flex self-end justify-end py-1 shadow-sm text-sm font-medium rounded-md text-white bg-orange-400 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                          >
                            Logout
                          </button>
                        </div>
                      </>
                    )
                    : (
                      <NavLink to="/new-channel" activeClassName="font-bold" className={navLinkMobile}>Login</NavLink>
                    )
                }

              </>
            )
            : ('')
        }
      </div>
    </div>
  );
};

const Navbar = () => {
  const user = useSelector((state) => state.activeUser);
  const dispatch = useDispatch();

  return (
    <div className="bg-blue-500 py-4">
      <div className="flex justify-end space-x-4">
        <div className="hidden md:block px-10">
          <NavLink to="/new-channel" activeClassName="font-bold" className={navLink}>New channel</NavLink>
          {/* Conditionally rendering the link to login */}
          {
            user
              ? (
                <>
                  <NavLink to="/channels/all" activeClassName="font-bold" className={navLink}>All channels</NavLink>
                  <span className="text-white mr-2">
                    Hello,
                    {' '}
                    {user.username}
                    !
                  </span>
                  <button
                    type="button"
                    onClick={() => dispatch(logoutUser())}
                    className="px-3 py-1 mx-2 shadow-sm text-sm font-medium rounded-md text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Logout
                  </button>
                </>
              )
              : <NavLink to="/new-channel" activeClassName="font-bold" className="px-3 py-1 mx-2 shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">Login</NavLink>
          }
        </div>
      </div>
      <div className="md:hidden ml-0">
        <MobileNavbar />
      </div>
    </div>
  );
};

export default Navbar;
