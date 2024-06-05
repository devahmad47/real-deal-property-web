import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { selecteGroupList } from "../../../../Store/authSlice";
import { useSelector } from "react-redux";



export function Photos() {
  const { groupId } = useParams();
  const [currentGroupPho, setCurrentGroupPho] = useState([])
  const StoreGroups = useSelector(selecteGroupList);


  useEffect(() => {
    const mygroup = StoreGroups.find((group) => group._id === groupId)
    setCurrentGroupPho(mygroup.Media)
  }, [StoreGroups, groupId])




  return (<div>

    <div className="grid grid-cols-2 gap-2 my-2">
      {currentGroupPho.length > 0 ? currentGroupPho.filter((media => media.mediaType.includes('image'))).map((pho, index) => {
        return <img key={index} src={pho.mediaUrl} alt="img " className="h-40 w-full rounded-lg " />
      })
      :
      <div className="py-4 px-2 text-center w-full  col-span-2 font-bold "><p className="w-full p-1">No Images Found</p></div>

      }

    </div>
  </div>)
}