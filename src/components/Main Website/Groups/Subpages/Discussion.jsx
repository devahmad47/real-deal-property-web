import React, { useState } from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { selecteGroupList, } from "../../../Store/authSlice";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Posts } from "../../PostComponent/postComponent";


export function Discussion() {
    const navigate = useNavigate()
    const StoreGroups = useSelector(selecteGroupList);
    const location = useLocation();
    const { groupId } = useParams();
    const [filteredPosts, setfilteredPosts] = useState([])

    useEffect(() => {
        // document.title = location.pathname.slice(1)
        const name = location.pathname.slice(1).split('/')
        document.title = name[name.length - 1]
    }, [location])

    useEffect(() => {
        const mygroup = StoreGroups.find((group) => group._id === groupId)
        mygroup && setfilteredPosts(mygroup.groupDicussionsPost)

    }, [StoreGroups, groupId])


    return (<div className=" bg-green-100 px-10 py-3" >

        <div className=" bg-white rounded-md  w-full px-2 sm:px-6 lg:px-4 py-2">

            {/* <div className="border-b-2  border-gray-300  flex items-center justify-between my-2 p-1 py-2 ">

                <div className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Status</span>
                    <img
                        className="h-10 w-10 rounded-full"
                        src="/person.jpg"
                        alt=""
                    />
                </div>
                <div className="   w-11/12 rounded-3xl px-4 text-gray-600 text-lg  bg-gray-200  sm:ml-4 text-sm  p-1 ">
                    <div className="flex text-gray-600 items-center text-left bg-transparent  gap-2">

                        <div >
                            <MagnifyingGlassIcon className="block h-4 w-4" aria-hidden="true" />
                        </div>
                        <div className=" w-full">
                            <input
                                placeholder="Share a Deal"
                                type="search"
                                className={'bg-transparent p-1  w-full focus:outline-none text-left  sm:text-sm sm:leading-6 '}

                            />
                        </div>
                    </div>
                </div>
            </div> */}
            <div onClick={() => {
                navigate(`/page/create_post/Discussionpost/${groupId}`)
            }} className="flex items-center w-full justify-between gap-2 p-2 rounded-md shadow-md hover:shadow-none hover:bg-gray-200 cursor-pointer">
                <p className="font-semibold">
                    Create a Post
                </p>
                <div>

                    <img src="/photoDoc.svg" alt="img" className="w-5 h-5" />
                </div>
            </div>
            {/* <div className=" flex items-center  justify-around text-gray-500 ">
                <div className="flex items-center justify-between gap-2 p-2 hover:bg-gray-200 cursor-pointer ">
                    <img src="/doc.png" alt="img" className="w-5 h-5" />
                    <p>
                        Complete Form
                    </p>

                </div>
                <div className="flex items-center justify-between gap-2 p-2 hover:bg-gray-200 cursor-pointer">
                    <img src="/photoDoc.svg" alt="img" className="w-5 h-5" />
                    <p>
                        Add video / Photo
                    </p>
                </div>
            </div> */}
        </div>

        <Posts groupId={groupId} deleteWhat={""} filteredPosts={filteredPosts} />

    </div>)
}



