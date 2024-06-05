import React , { useEffect  , useState} from "react";
import { selecteGroupList } from "../../../Store/authSlice";
import { useSelector } from "react-redux";
import { useParams , useLocation } from "react-router-dom";



export function MembersPage() {
   
    const { groupId } = useParams();
    const [currentGroupMeb, setCurrentGroupMeb] = useState()
    const StoreGroups = useSelector(selecteGroupList);

    const location = useLocation();
    useEffect(() => {
        // document.title = location.pathname.slice(1)
        const name =  location.pathname.slice(1).split('/')
        document.title = name[name.length - 1]
    }, [location])

    useEffect(() => {
        const mygroup = StoreGroups.find((group) => group._id === groupId)
        setCurrentGroupMeb(mygroup.Members)
    }, [StoreGroups, groupId])


    return (<div className="">
        <div className="my-2">
            {currentGroupMeb &&
                currentGroupMeb.map((meb, index) => {
                    return <div key={index} className="flex my-3 items-center justify-between gap-2  bg-gray-300     rounded-lg p-2 shadow-lg cursor-pointer">
                        <div className="relative flex rounded-full  text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">

                            <img
                                className="h-10 w-10 rounded-full"
                                src={"/" + meb.ProfileImage}
                                alt=""
                            />
                        </div>
                        <div>
                            <h3 className="font-bold">{meb.UserName}</h3>
                            <p>
                                {meb.description}
                            </p>
                        </div>
                        <div className="my-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-none px-2 py-2">
                            <button>Message </button>
                        </div>
                    </div>

                })
            }

        </div>

    </div>)
}