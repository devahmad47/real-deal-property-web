import React, { useRef, useState } from "react";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, } from '@heroicons/react/24/outline'
import { BellIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import style from "./header.module.css"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import SideBar from "../NotifySideBar/NotifySideBar";
import { useDispatch, useSelector } from "react-redux";
import { logout, selecteCurrentUser, selecteNotification } from "../../Store/authSlice";




export function Header() {
    const storeNotification = useSelector(selecteNotification);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const storeCurrentUser = useSelector(selecteCurrentUser)
    const [openNotify, setOpenNotify] = useState(false)
    const closeButton = useRef()
    const location = useLocation();
    const [dropDownOpen, setDropDownOpen] = useState(false);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const navigation = [
        { name: 'Home', to: '/page/Home', current: true },
        // { name: 'Profile', to: '/page/Profile', current: false },
        {
            name: 'Connections',
            current: false,
            subpages: [
                {
                    name: 'Request',
                    to: '/page/Request',
                },
                {
                    name: 'Your Connections',
                    to: '/page/Connections',
                },
            ],
        },
        // { name: 'Groups', to: '/page/Groups', current: false },
        { name: 'Saved', to: '/page/Saved', current: false },
    ]




    return (<>
        <SideBar openNotify={openNotify} setOpenNotify={setOpenNotify} />

        <Disclosure as="nav" style={{ boxShadow: ` 5px 5px 10px rgba(0, 0, 0, 0.2)` }} className="bg-white py-1 ">
            {({ open }) => (
                <>
                    <div className=" w-full px-2 ">
                        <div className="relative flex h-14 items-center justify-between">


                            <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button ref={closeButton} className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-cyan-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>



                            <div className="flex flex-1 items-center md:ml-0 ml-10 sm:items-stretch justify-start">

                                <Link to={'/page/Home'} className="flex flex-shrink-0 mx-1 items-center">
                                    <img
                                        title="Facebook"
                                        className="h-11 w-auto"
                                        src="/Real Deal Exchange_FullLogo_White.png"
                                        alt="Your Company"
                                    />
                                </Link>
                                {/* 
                                <div onClick={() => { setSeatchBarOpen(!searchBarOpen) }} className="relative block sm:hidden   mx-2 p-2  bg-gray-300 rounded-3xl  text-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800   ">

                                    <button
                                        title="Search"
                                        type="button"
                                        className=" p-1 text-black hover:text-gray-700 "
                                    >
                                        <span className="absolute-inset-1.5" />
                                        <span className="sr-only">Search</span>
                                        <MagnifyingGlassIcon className=" h-5 w-5" aria-hidden="true" />
                                    </button>

                                </div>
 */}

                                {/* 
                                <div style={{ display: searchBarOpen ? 'block' : '', top: "5px", left: 0 }}
                                    className={classNames(searchBarOpen ? `${style.anim}` : `${style.outanim} `, 'w-80  p-2 absolute  z-4 shadow-xl bg-white  rounded-lg ')}
                                >
                                    <div className="flex items-center justify-center gap-1 mb-4">
                                        <div onClick={() => {
                                            setSeatchBarOpen(!searchBarOpen)
                                        }} className="hover:rounded-2xl hover:cursor-pointer hover:bg-gray-200 p-2">
                                            <ArrowLeftIcon className="block h-4 w-4" aria-hidden="true" />
                                        </div>
                                        <div className=" rounded-3xl px-4 text-gray-600 text-lg  bg-gray-200  sm:ml-4 text-sm  sm:block p-1 ">
                                            <div className="flex items-center bg-transparent justify-between gap-2">

                                                <div>
                                                    <MagnifyingGlassIcon className="block h-4 w-4" aria-hidden="true" />
                                                </div>
                                                <div>
                                                    <input

                                                        placeholder="Search Facebook"
                                                        type="search"
                                                        className={'bg-transparent p-1 focus:ring-0  border-0 focus:outline-none  sm:text-sm sm:leading-6 '}

                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className=" ">
                                        <p className="text-center my-2 text-gray-600">No Recent Search</p>

                                    </div>
                                </div> */}

                                {/* <div onClick={() => {
                                    setSeatchBarOpen(!searchBarOpen)
                                }} className="hidden rounded-3xl px-4 text-gray-600 text-lg  bg-gray-200  sm:ml-4 text-sm  sm:block p-1 ">
                                    <div className="flex items-center bg-transparent justify-between gap-2">

                                        <div>
                                            <MagnifyingGlassIcon className="block h-4 w-4" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <input

                                                placeholder="Search Facebook"
                                                type="search"
                                                className={'bg-transparent p-1  border-0 focus:ring-0 focus:outline-none  sm:text-sm sm:leading-6 '}

                                            />
                                        </div>
                                    </div>
                                </div> */}

                            </div>


                            <div className="absolute  inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <Link to={"/Chats"} className="relative mx-2  bg-gray-300 rounded-3xl p-1 text-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800   ">

                                    <button
                                        title="View Chat"
                                        type="button"
                                        className="relative p-1 text-black hover:text-gray-700 "   >
                                        <span className="absolute-inset-1.5" />
                                        <span className="sr-only">View Chat</span>
                                        <img src="/messenger.png" alt="img" className="w-6 h-6" />

                                    </button>
                                    {/* <span style={{ top: "-2px", right: "-6px" }} className="bg-red-600  absolute top--10 right-0 w-4 h-4  text-xs text-center text-white rounded-lg ">
                                        2
                                    </span> */}
                                </Link>
                                <div onClick={() => { setOpenNotify(true) }} className="relative  bg-gray-300 rounded-3xl p-1 text-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800   ">

                                    <button
                                        title="view Notification"
                                        type="button"
                                        className="relative    p-1 text-black hover:text-gray-700 "
                                    >
                                        <span className="absolute-inset-1.5" />
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                    {storeNotification && storeNotification.length > 0 &&
                                        <span style={{ top: "-2px", right: "-6px" }} className="bg-red-600  absolute top--10 right-0 w-4 h-4  text-xs text-center text-white rounded-lg ">
                                            {storeNotification.length}
                                        </span>
                                    }
                                </div>




                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div title="Profile">
                                        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <img

                                                className="h-10 w-10 rounded-full"
                                                src={storeCurrentUser.profileImageUrl}
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
                                                    <Link to={"/page/Profile"}

                                                        className={classNames(active ? 'bg-gray-100 ' : '', 'block px-4 py-2 text-sm text-gray-700 hover:text-cyan-700')}
                                                    >
                                                        <div className="flex items-center justify-start gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                            </svg>
                                                            <span>
                                                                Your Profile
                                                            </span>
                                                        </div>
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            {/* <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="/"
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        Settings
                                                    </a>
                                                )}
                                            </Menu.Item> */}
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => {
                                                            dispatch(logout())
                                                            localStorage.removeItem('REAl_ESTATE_USER_DATA');
                                                            navigate("/Login")
                                                        }}
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 hover:text-cyan-700 w-full')}
                                                    >
                                                        <div className="flex items-center justify-start gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                                            </svg>

                                                            <span>
                                                                Sign out
                                                            </span>
                                                        </div>
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>



                        </div>
                    </div>



                    {/* mobile drop down items */}
                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2 w-full ">
                            {navigation.map((item, index) => (
                                <NavLink key={index} to={item.to}

                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    <div onClick={() => {
                                        if (item.name === 'Connections') {
                                            setDropDownOpen(!dropDownOpen)
                                        } else {
                                            setDropDownOpen(false)
                                            closeButton.current.click()
                                        }

                                    }} className={classNames(
                                        item.to ? location.pathname === item.to ? 'bg-cyan-700 text-white' : 'text-gray-500 hover:bg-cyan-400 hover:text-white bg-gray-100' : ' bg-gray-100 text-gray-500 hover:bg-cyan-400 hover:text-white',
                                        ' rounded-md px-3 py-2 text-base font-medium w-full my-2 flex justify-between items-center '
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
                                            <Link onClick={() => {
                                                closeButton.current.click()

                                            }} to={subpages.to} className={classNames(location.pathname === subpages.to ? 'bg-cyan-700 text-white' : 'bg-gray-100 text-gray-500 hover:bg-cyan-400 hover:text-white', " block rounded-md px-3 py-2 text-base font-medium ml-8 my-1 ")}>
                                                {subpages.name}
                                            </Link>
                                        </div>
                                    })

                                    }

                                </NavLink>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure >

    </>
    )
}