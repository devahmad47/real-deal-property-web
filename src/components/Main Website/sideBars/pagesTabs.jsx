import React from "react";
import { HomeIcon, UserPlusIcon, UserGroupIcon, BookmarkIcon, UserIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import style from "./sidebar.module.css"
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selecteCurrentUser, } from "../../Store/authSlice";
// selecteAllPost, selecteGroupList 

export function SidepageTabs() {
    const storeCurrentUser = useSelector(selecteCurrentUser)
    // const [savedShortcuts, setsavedShortcuts] = useState([])
    // const storeAllPosts = useSelector(selecteAllPost)
    // const storeGroupList = useSelector(selecteGroupList)
    const location = useLocation();
    const [dropDownOpen, setDropDownOpen] = useState(false);
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    useEffect(() => {
        setDropDownOpen(false)
    }, [])


    // useEffect(() => {
    //     if (storeCurrentUser && storeCurrentUser.shortcuts.length >= 0) {

    //         const AllShorcutsGroup = storeCurrentUser.shortcuts.map((savedShortcuts) => {

    //             const groupIndex = storeGroupList.findIndex((group) => group._id === savedShortcuts.groupID);
    //             if (groupIndex !== -1) {
    //                 const Dispost = storeGroupList[groupIndex]
    //                 return Dispost ? Dispost : null;
    //             }
    //             return null
    //         }).filter(post => post !== null);

    //         setsavedShortcuts(AllShorcutsGroup);
    //     }
    // }, [storeCurrentUser, storeCurrentUser.shortcuts, storeGroupList, storeAllPosts]);
 

    return (<div>

        <Link to={"/page/Profile"} className={classNames(location.pathname === '/page/Profile' ? 'border-l-4 border-cyan-700 bg-gray-200' : '', " my-1 p-2 flex justify-start hover:bg-gray-200 cursor-pointer items-center gap-3 ")}>
            <div className="relative flex rounded-full  text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                    className="h-10 w-10 rounded-full"
                    src={storeCurrentUser.profileImageUrl}
                    alt=""
                />
            </div>
            <div>
                <h3 className="font-semibold text-medium ">
                    {storeCurrentUser.username}
                </h3>
            </div>
        </Link>
        <Link to={'/page/Home'} onClick={() => { setDropDownOpen(false) }} className={classNames(location.pathname === '/page/Home' ? 'border-l-4 border-cyan-700 bg-gray-200' : '', " my-3 p-2 flex  justify-start items-center gap-3 hover:bg-gray-200  cursor-pointer ")}>

            <div className="relative flex rounded-full  text-cyan-500 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Home</span>
                <HomeIcon className="block h-6 w-6" aria-hidden="true" />
            </div>
            <div  >
                <h3 className="font-semibold text-medium ">
                    Home
                </h3>
            </div>
        </Link>

        <div onClick={() => { setDropDownOpen(!dropDownOpen) }} className={" my-3 p-2 flex justify-between items-center gap-3 hover:bg-gray-200 cursor-pointer  "}>
            <div className="flex justify-start items-center gap-2">
                <div className="relative flex text-cyan-500 rounded-full  text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    {/* <span className="absolute -inset-1.5" />
                    <span className="sr-only">Connections</span> */}
                    {/* <img
                        className="h-6 w-6 rounded-full"
                        src="/connections.svg"
                        alt=""
                    /> */}
                    <UserIcon className="block h-6 w-6" aria-hidden="true" />

                </div>
                <div  >
                    <h3 className="font-semibold text-medium">
                        Connections
                    </h3>
                </div>
            </div>
            <div className="cursor-pointer text-cyan-700">
                {dropDownOpen ?
                    <ChevronUpIcon className="block h-6 w-6" aria-hidden="true" />
                    :
                    <ChevronDownIcon className={`block h-6 w-6 ${style.bottom} `} aria-hidden="true" />}
            </div>
        </div>


        <div style={{ display: dropDownOpen ? 'block' : 'none' }} className={classNames(dropDownOpen ? style.bottom : '')}>
            <Link to={'/page/Request'} className={classNames(location.pathname === '/page/Request' ? 'border-l-4 border-cyan-700 bg-gray-200' : '', " my-3 p-2 ml-8 flex justify-start items-center gap-3 hover:bg-gray-200  cursor-pointer ")}>
                <div className="relative  flex rounded-full text-cyan-500  text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Requsts</span>

                    <UserPlusIcon className="block h-6 w-6" aria-hidden="true" />


                </div>
                <div>
                    <h3 className="font-semibold text-medium">
                        Requests
                    </h3>
                </div>
            </Link>
            <Link to={'/page/Connections'} className={classNames(location.pathname === '/page/Connections' ? 'border-l-4 border-cyan-700 bg-gray-200' : '', " my-3 p-2 ml-8 flex justify-start items-center gap-3 hover:bg-gray-200  cursor-pointer ")}>
                <div className="relative text-cyan-500  flex rounded-full  text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Your Connections</span>
                    <UserGroupIcon className="block h-6 w-6" aria-hidden="true" />

                </div>
                <div>
                    <h3 className="font-semibold text-medium">
                        Your Connections
                    </h3>
                </div>
            </Link>

        </div>

                {/* <span className="absolute -inset-1.5" />
                <span className="sr-only">Groups</span>
                <img
                    className="h-6 w-6 rounded-full"
                    src="/groups.svg"
                    alt=""
                /> */}
        {/* <Link to={'/page/Groups'} onClick={() => { setDropDownOpen(false) }} className={classNames(location.pathname === '/page/Groups' ? 'border-l-4 border-cyan-700 bg-gray-200' : '', " my-3 p-2 flex justify-start items-center gap-3 hover:bg-gray-200  cursor-pointer ")}>
            <div className="relative flex rounded-full  text-cyan-500 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <UserGroupIcon className="block h-6 w-6" aria-hidden="true" />

            </div>
            <div>
                <h3 className="font-semibold text-medium">
                    Groups
                </h3>
            </div>
        </Link> */}

        <Link to={'/page/Saved'} onClick={() => { setDropDownOpen(false) }} className={classNames(location.pathname === '/page/Saved' ? 'border-l-4 border-cyan-700 bg-gray-200' : '', " my-3 p-2 flex justify-start items-center gap-3 hover:bg-gray-200  cursor-pointer ")}>
            <div className="relative flex rounded-full text-cyan-500 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                {/* <span className="absolute -inset-1.5" />
                <span className="sr-only">Saved</span>
                <img
                    className="h-6 w-6 rounded-full"
                    src="/saved.svg"
                    alt=""
                /> */}
                <BookmarkIcon className="block h-6 w-6" aria-hidden="true" />

            </div>
            <div>
                <h3 className="font-semibold text-medium ">
                    Saved
                </h3>
            </div>
        </Link>


        {/* {savedShortcuts.length > 0 && <div>
            <h2 className="my-3 font-bold text-left text-xl">
                Your Shortcuts
            </h2>
            {savedShortcuts.map((grp, index) => {
                return <Link to={`/page/Groups/${grp._id}/Discussion`} key={index}
                    className={classNames(location.pathname.includes(`/page/Groups/${grp._id}`) ? 'border-l-4 border-cyan-700 bg-gray-200' : '', "my-3 p-2 flex justify-start items-center gap-3 hover:bg-gray-200 cursor-pointer")}>
                    <div className="relative flex rounded-full  text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">{grp.groupName}</span>
                        <img
                            className="h-6 w-6 rounded-full"
                            src={grp.groupThumbnilURL}
                            alt=""
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-medium">
                            {grp.groupName}
                        </h3>
                    </div>
                </Link>
            })}
        </div>
        } */}

    </div>)
}


