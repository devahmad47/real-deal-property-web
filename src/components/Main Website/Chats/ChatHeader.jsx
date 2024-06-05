import React from "react";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, } from '@heroicons/react/24/outline'
// import { BellIcon } from '@heroicons/react/24/solid'
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../Store/authSlice";
import { selecteCurrentUser } from "../../Store/authSlice";
import { useSelector } from "react-redux";
export function ChatHeader(props) {
    const StoreCurrentUser = useSelector(selecteCurrentUser)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    // const navigation = [
    //     { name: 'Home', to: '/page/Home', current: true },
    //     { name: 'Profile', to: '/page/Profile', current: false },
    //     {
    //         name: 'Connections',
    //         current: false,
    //         subpages: [
    //             {
    //                 name: 'Request',
    //                 to: '/page/Request',
    //             },
    //             {
    //                 name: 'Your Connections',
    //                 to: '/page/Connections',
    //             },
    //         ],
    //     },
    //     { name: 'Groups', to: '/page/Groups', current: false },
    //     { name: 'Saved', to: '/page/Saved', current: false },
    // ]
    return (<>

        <Disclosure as="nav" style={{ boxShadow: ` 5px 5px 10px rgba(0, 0, 0, 0.2)` }} className="bg-white p-0 ">
            {({ open }) => (
                <>
                    <div className=" w-full px-2 ">
                        <div className="relative flex h-14 items-center justify-between">


                            <div onClick={() => {
                                props.setshowSidebar(!props.showSidebar)
                            }} className="absolute inset-y-0 left-0 flex items-center ">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="relative inline-flex bg-gray-200 items-center shadow-md hover:shadow-none    justify-center rounded-md p-2 text-gray-400 hover:bg-cyan-700 hover:text-white focus:outline-none focus:ring-0 ">

                                    {props.showSidebar ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>



                            <div className="flex flex-1 items-center ml-12 sm:items-stretch justify-start">

                                <Link to={'/page/Home'} className="flex flex-shrink-0 mx-1 items-center">
                                    <img
                                        title="Facebook"
                                        className="h-11 w-auto"
                                        src="/Real Deal Exchange_FullLogo_White.png"
                                        alt="Your Company"
                                    />
                                </Link>
                            </div>


                            <div className="absolute  inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {/* <Link to={"/Chats"} className="relative mx-2  bg-gray-300 rounded-3xl p-1 text-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800   ">

                                    <button
                                        title="View Chat"
                                        type="button"
                                        className="relative p-1 text-black hover:text-gray-700 "   >
                                        <span className="absolute-inset-1.5" />
                                        <span className="sr-only">View Chat</span>
                                        <img src="/messenger.png" alt="img" className="w-6 h-6" />

                                    </button>
                                    <span style={{ top: "-2px", right: "-6px" }} className="bg-red-600  absolute top--10 right-0 w-4 h-4  text-xs text-center text-white rounded-lg ">
                                        2
                                    </span>
                                </Link> */}
                                {/* <div className="relative  bg-gray-300 rounded-3xl p-1 text-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800   ">

                                    <button
                                        title="view Notification"
                                        type="button"
                                        className="relative    p-1 text-black hover:text-gray-700 "
                                    >
                                        <span className="absolute-inset-1.5" />
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                    <span style={{ top: "-2px", right: "-6px" }} className="bg-red-600  absolute top--10 right-0 w-4 h-4  text-xs text-center text-white rounded-lg ">
                                        4
                                    </span>
                                </div> */}




                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div title="Profile">
                                        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <img

                                                className="h-10 w-10 rounded-full"
                                                src={StoreCurrentUser.profileImageUrl}
                                                alt=""
                                            />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to={"/page"}
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        Home
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to={"/page/Profile"}
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        Your Profile
                                                    </Link>
                                                )}
                                            </Menu.Item>

                                            <Menu.Item>
                                                {({ active }) => (
                                                    <div
                                                        onClick={() => {
                                                            dispatch(logout())
                                                            localStorage.removeItem('REAl_ESTATE_USER_DATA');
                                                            navigate("/Login")
                                                        }}
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        Sign out
                                                    </div>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>



                        </div>
                    </div>



                    {/* mobile drop down items
                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2 w-full ">
                            {navigation.map((item, index) => (
                                <NavLink key={index} to={item.to}

                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    <div onClick={() => {
                                        if (item.name === 'Connections') {
                                            setDropDownOpen(!dropDownOpen)
                                        }else{
                                            setDropDownOpen(false)
                                        }

                                    }} className={classNames(
                                        item.to ? location.pathname === item.to ? 'bg-cyan-700 text-white' : 'text-gray-500 hover:bg-cyan-400 hover:text-white bg-gray-100' : ' bg-gray-100 text-gray-500 hover:bg-cyan-400 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium w-full my-2 flex justify-between items-center '
                                    )} >
                                        <div>
                                            {item.name}
                                        </div>
                                        {
                                            item.subpages ? <div>
                                                {dropDownOpen ?
                                                    <ChevronUpIcon className="block h-6 w-6" aria-hidden="true" />
                                                    :
                                                    <ChevronDownIcon className={`block h-6 w-6 ${style.bottom} `} aria-hidden="true" />}
                                            </div> : ''
                                        }

                                    </div>
                                    {item.subpages && item.subpages.map((subpages, index) => {
                                        return <div key={index} style={{ display: dropDownOpen ? 'block' : 'none' }} className={classNames(dropDownOpen ? style.bottom : '')}>
                                            <Link to={subpages.to} className={classNames(location.pathname === subpages.to ? 'bg-cyan-700 text-white' : 'bg-gray-100 text-gray-500 hover:bg-cyan-400 hover:text-white', " block rounded-md px-3 py-2 text-base font-medium ml-8 my-1 ")}>
                                                {subpages.name}
                                            </Link>
                                        </div>
                                    })

                                    }

                                </NavLink>
                            ))}
                        </div>
                    </Disclosure.Panel> */}
                </>
            )}
        </Disclosure >

    </>
    )
}