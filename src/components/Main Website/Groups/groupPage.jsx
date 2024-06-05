import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import { selecteGroupList } from "../../Store/authSlice";
import { useSelector } from "react-redux";
// MagnifyingGlassIcon

export function GroupPage() {
    const location = useLocation();
    const [currentGroupDis, setCurrentGroupDis] = useState()
    const StoreGroups = useSelector(selecteGroupList);

    const { groupId } = useParams();
    useEffect(() => {
        const mygroup = StoreGroups.find((group) => group._id === groupId)

        if (mygroup) {
            setCurrentGroupDis(mygroup)
        }

    }, [StoreGroups, groupId])

    useEffect(() => {
        // document.title = location.pathname.slice(1)
        const name =  location.pathname.slice(1).split('/')
        document.title = name[name.length - 1]
    }, [location])
    const Tabs = [
        {
            name: 'Discussion',
            to: `/page/Groups/${groupId}/Discussion`,
            current: true,
        },
        {
            name: 'Media',
            to: `/page/Groups/${groupId}/Media/Videos`,
            current: false,
        },
        // {
        //     name: 'Members',
        //     to: `/page/Groups/${groupId}/Members`,
        //     current: false,
        // },
    ]

    return (<div>
        {currentGroupDis ?
            <div>
                <div className="w-full bg-white  rounded-md">
                    <img src={currentGroupDis.groupThumbnilURL} alt="img" className="w-full h-80 rounded-lg" />
                    <div className=" px-3">
                        <h2 className="my-2 font-bold text-3xl text-left font-sans ">{currentGroupDis.groupName}</h2>


                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center justify-between  gap-2">
                                {Tabs.map((subtabs, index) => {
                                    return <Link to={subtabs.to} className={`${location.pathname === subtabs.to ? 'border-b-2 border-green-800  text-green-600 font-bold' : 'text-gray-500'} `} key={index}>
                                        <div className="rounded-lg hover:bg-gray-300 py-3 px-2 my-1">
                                            {subtabs.name}
                                        </div>
                                    </Link>
                                })}
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                {/* <button className="flex items-center justify-between gap-2 shadow-lg hover:shadow-none bg-gray-300 hover:bg-gray-400  px-2 rounded-lg text-lg py-3 ">
                            <MagnifyingGlassIcon className="block h-4 w-4" aria-hidden="true" />
                        </button> */}

                                {/* <button className="flex items-center justify-between gap-2 shadow-lg hover:shadow-none text-white bg-green-600  hover:bg-green-700 px-2 rounded-lg text-lg py-1 ">
                                    <PlusSmallIcon className="block h-4 w-4 text-white" aria-hidden="true" />
                                    Invite
                                </button> */}
                            </div>

                        </div>

                    </div>
                </div>
                <div>

                    <Outlet />
                </div>
            </div> :
            <div><p>No Group found</p></div>
        }
    </div>)
}