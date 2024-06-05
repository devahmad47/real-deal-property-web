import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { selecteGroupList } from "../../Store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import CreateGroup from "./CreateGroupModel/createGroupModel";
import { updateGroup, updateUser, selecteCurrentUser } from "../../Store/authSlice";
import DeleteModel from "../modelDelete/modelDelete";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader } from "../Loader/loader";
import CryptoJS from 'crypto-js';
const serverURL = process.env.REACT_APP_SERVER_URL
const secretEnKey = process.env.REACT_APP_SECRET_ENC_KEY


export function Groups() {
    const StoreGroups = useSelector(selecteGroupList);
    const StoreCurrentUser = useSelector(selecteCurrentUser);
    const [deletedId, setdeletedId] = useState('')
    const [loading, setloading] = useState(false)
    // const [file, setfile] = useState()

    const dispatch = useDispatch();
    const [open, setOpen] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [deleteA, setDeleteA] = useState(false)
    // const [pined, setPined] = useState(StoreGroups.map((grp) => grp.Pined))
    const [searchpost, setSearchPost] = useState('')
    const [FilteredGroups, setFilteredGroups] = useState(StoreGroups)

    // const togglPin = (index) => {
    //     const updatedStates = [...pined];
    //     updatedStates[index] = !updatedStates[index];
    //     setPined(updatedStates);
    // }

    const location = useLocation();
    useEffect(() => {
        const name = location.pathname.slice(1).split('/')
        document.title = name[name.length - 1]
    }, [location])


    useEffect(() => {
        setFilteredGroups(StoreGroups)
    }, [StoreGroups])


    const encryptUserData = (data, secretKey) => {
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);
        return encryptedData.toString();
    }

    const isUserPinedGroup = (groupId) => {
        const groupPinedExist = StoreCurrentUser.shortcuts.find(grp => grp.groupID === groupId)
        return groupPinedExist ? true : false
    }
    return (<div>


        {/* filtered groups */}
        <div className=" shadow-lg hover:border-2 hover:border-cyan-500 my-2   w-10/12 mx-auto rounded-3xl px-4 text-gray-600 text-lg  bg-white shadow-mg   p-1 ">
            <form onSubmit={(e) => {
                e.preventDefault()
                if (searchpost.trim() === '') {
                    setSearchPost('')
                    return
                }
                const filteredGroups = StoreGroups.filter((groups) => {
                    if (groups.groupName.toLowerCase().includes(searchpost.toLowerCase())) {
                        return true
                    }
                    return false;
                });

                setFilteredGroups(filteredGroups);


                setSearchPost('')

            }} className="flex  text-gray-600 items-center text-left bg-transparent  gap-2">

                <div className=" w-full">
                    <input
                        value={searchpost}
                        onChange={(e) => {
                            setSearchPost(e.target.value)
                        }}
                        placeholder="Find Group"
                        type="search"
                        className={'bg-transparent p-1  w-full focus:outline-none text-left  sm:text-sm sm:leading-6 '}

                    />
                </div>

                <button type="submit" >
                    <MagnifyingGlassIcon className="block h-4 w-4" aria-hidden="true" />
                </button>
            </form>
        </div>

        {/* joined groups */}
        <div className="flex items-center justify-between  my-2 gap-2  bg-cyan-300 border-l-4 border-cyan-800 p-2 px-4 rounded-lg">

            <h3 className="font-semibold text-lg my-2 text-cyan-700">
                All the groups you have joined
            </h3>
            <h3 className="text-white italic">
                543
            </h3>
        </div>

        <button onClick={() => {
            setOpen(true)
        }} className="my-2 w-full hover:shadow-none  hover:bg-cyan-600 hover:text-white p-2 bg-white rounded-md shadow-lg cursor-pointer  font-bold text-lg text-cyan-500">
            Create a Group

        </button>

        {/* <form onSubmit={userSIngUp} >
            <input type="file" onChange={(e) => {
                setfile(e.target.files[0])
            }} />
            <button type="submit" className="px-4 py-2 bg-cyan-300 text-white" >
                add data
            </button>
        </form> */}

        {FilteredGroups.length > 0 ?
            <div className="grid grid-cols-2 gap-2 ">

                {
                    FilteredGroups.map((group, index) => {
                        return <div key={index} className="h-48 border bg-white shadow-lg col-span-2 md:col-span-1  p-1 rounded-xl ">

                            <Link to={`/page/Groups/${group._id}/Discussion`} className="grid grid-cols-2 md:grid-cols-3 gap-3 my-2 ">
                                <div className="cursor-pointer col-span-1 ">
                                    <img src={group.groupThumbnilURL} alt="img" className="w-full h-28 md:w-28  rounded-lg" style={{ objectFit: "cover", objectPosition: "center" }} />
                                </div>
                                <div className="text-left  col-span-1 md:col-span-2  p-1">
                                    <div className="my-2     ">
                                        <h3 className="font-bold text-lg text-left">{group.groupName}</h3>
                                    </div>
                                    <div>
                                        <h3 className="text-sm text-left">{group.groupDescription}</h3>
                                    </div>
                                </div>
                            </Link>

                            <div className="my-2 w-full grid grid-cols-3 gap-2  p-1">
                                <Link to={`/page/Groups/${group._id}/Discussion`} className="col-span-2">
                                    <div className=" w-11/12 py-2 mx-auto text-cyan-700 bg-cyan-200 hover:bg-cyan-300    rounded-lg shadow-lg hover:shadow-none  text-center font-semibold">
                                        View group
                                    </div>

                                </Link>
                                <div className="flex items-center justify-end   gap-2  col-span-1  ">

                                    <div onClick={async () => {
                                      
                                        if (loading) {
                                            toast.info("Request Already in Progess")
                                            return
                                        }
                                        const mygroupPined = isUserPinedGroup(group._id)
                                        if (mygroupPined) {
                                            try {
                                                setloading(true)
                                                const response = await axios.delete(`${serverURL}/api/users/removeShortcut/${StoreCurrentUser._id}/${group._id}`)
                                                setloading(false)
                                                if (response && response.status === 200) {
                                                   
                                                    toast.success(response.data.message);
                                                    dispatch(updateUser(response.data.updatedUser))
                                                    dispatch(updateGroup({ groupId: response.data.updatedGroup._id, Pined: response.data.updatedGroup.Pined }))
                                                    const user = encryptUserData(response.data.updatedUser, secretEnKey);
                                                    localStorage.setItem('REAl_ESTATE_USER_DATA', JSON.stringify({ user, expiration: response.data.updatedUser.sessionExpiration }));

                                                }
                                            } catch (error) {
                                                setloading(false)
                                                if (error) {
                                                    if (error.response) {
                                                        toast.error(error.response.data.message);
                                                        
                                                    } else {
                                                        toast.error("Failed to Remove Shorcut");
                                                    }
                                                }
                                            }

                                        }
                                        else {

                                            try {
                                                const response = await axios.delete(`${serverURL}/api/users/removeShortcut/${StoreCurrentUser._id}/addShortcuts`, group)
                                                setloading(false)

                                                if (response && response.status === 200) {
                                                   
                                                    toast.success(response.data.message);
                                                    dispatch(updateUser(response.data.updatedUser))
                                                    dispatch(updateGroup({ groupId: response.data.updatedGroup._id, Pined: response.data.updatedGroup.Pined }))
                                                    const user = encryptUserData(response.data.updatedUser, secretEnKey);
                                                    localStorage.setItem('REAl_ESTATE_USER_DATA', JSON.stringify({ user, expiration: response.data.updatedUser.sessionExpiration }));

                                                }
                                            } catch (error) {
                                                setloading(false)
                                                if (error) {
                                                    if (error.response) {
                                                        
                                                        toast.error(error.response.data.message);
                                                    } else {
                                                        toast.error("Failed to add shorcut");
                                                    }
                                                }
                                            }
                                        }

                                    }} className=" flex items-center cursor-pointer  justify-center">
                                        {isUserPinedGroup(group._id) ?
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pin-angle-fill" viewBox="0 0 16 16">
                                                <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z" />
                                            </svg> :
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="bi bi-pin-angle" viewBox="0 0 16 16">
                                                <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z" />
                                            </svg>
                                        }
                                    </div>
                                    {StoreCurrentUser._id === group.CreatorID &&
                                        <div onClick={() => {
                                            setDeleteA(true)
                                            setdeletedId(group._id)
                                            setGroupName(group.groupName)
                                        }} className="cursor-pointer  ">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>

                                        </div>
                                    }
                                </div>

                            </div>

                        </div>
                    })
                }


            </div>
            :
            <div>
                <p>
                    No Groups Found
                </p>
            </div>
        }
        <CreateGroup open={open} setOpen={setOpen} />
        <Loader loading={loading} />
        <DeleteModel deleteWhat={"group"} deletedId={deletedId} heading={"Delete Group"} bodyContent={`Are you sure you want to delete ${groupName} Group ? This action cannot be undone.`} buttonContent={"Delete"} deleteA={deleteA} setDeleteA={setDeleteA} />


    </div >)
}



