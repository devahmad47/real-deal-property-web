import React, { useState  , useEffect} from "react";
import { useLocation, useParams, Link, Outlet } from "react-router-dom";
import AddGroupMedia from "./nestedSubPages/addMedia";


export function MediaPage() {
    const { groupId } = useParams();
    const location = useLocation();
    const [open, setOpen] = useState(false)

    const Tabs = [
        {
            name: 'Videos',
            to: `/page/Groups/${groupId}/Media/Videos`,
            current: true,
        },
        {
            name: 'Photos',
            to: `/page/Groups/${groupId}/Media/Photos`,
            current: false,
        },

    ]
    useEffect(() => {
        // document.title = location.pathname.slice(1)
        const name =  location.pathname.slice(1).split('/')
        document.title = name[name.length - 1]
    }, [location])

    return (<div className="bg-blue-100 px-10 py-3">

        <div  className="bg-white p-2 rounded-lg">
            <div onClick={()=>{
                setOpen(true)
            }} className=" my-2    flex items-center justify-between gap-2  ">
                <h3 className="font-bold text-lg">Media </h3>
                <button className="text-blue-500 font-semibold text-medium">
                    Add Photos / Vidoes
                </button>
            </div>
            <div className="flex   items-center justify-start  gap-2">
                {Tabs.map((subtabs, index) => {
                    return <Link to={subtabs.to} className={`${location.pathname === subtabs.to ? 'border-b-2 border-blue-800  text-blue-600 font-bold' : 'text-gray-800 font-semibold'} `} key={index}>
                        <div className="rounded-lg hover:bg-gray-300 py-3 px-2 my-1">
                            {subtabs.name}
                        </div>
                    </Link>
                })}
            </div>

            <div>
                <Outlet />
            </div>

        </div>

        <AddGroupMedia setOpen={setOpen}  open={open}  groupId={groupId} />
    </div>)
}