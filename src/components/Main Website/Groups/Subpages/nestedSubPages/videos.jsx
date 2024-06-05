import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { selecteGroupList } from "../../../../Store/authSlice";
import { useSelector } from "react-redux";


export function Videos() {

    const { groupId } = useParams();
    const [currentGroupVid, setCurrentGroupVid] = useState([])
    const StoreGroups = useSelector(selecteGroupList);


    useEffect(() => {
        const mygroup = StoreGroups.find((group) => group._id === groupId)
        setCurrentGroupVid(mygroup.Media)
    }, [StoreGroups, groupId])




    return (<div>
        
        <div className="grid grid-cols-2 gap-2 my-2">
            {currentGroupVid.length > 0 ? currentGroupVid.filter((media => media.mediaType.includes('video'))).map((vid, index) => {
                return <video key={index} style={{ objectFit: "cover", borderRadius: "10px" }} width="100%" className="h-56" controls>
                    <source src={vid.mediaUrl} type="video/mp4" />
                </video>
            })
                :
                <div className="py-4 px-2 text-center w-full  col-span-2 font-bold "><p className="w-full p-1">No Videos Found</p></div>
            }

        </div>

    </div>)
}