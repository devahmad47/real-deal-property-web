import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {  addNotification, selecteUsers, selecteCurrentUser, addToAlusers, login } from "../../Store/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Loader } from "../Loader/loader";
import axios from "axios";
// import { SearchPage } from "./searchPage";
import CryptoJS from 'crypto-js';
const secretEnKey = process.env.REACT_APP_SECRET_ENC_KEY
const serverURL = process.env.REACT_APP_SERVER_URL


export function Request() {
    const StoreAllUser = useSelector(selecteUsers)
    const StoreCurrentUser = useSelector(selecteCurrentUser)
    const [otherUsers, setOtherUsers] = useState()
    const [searchinput, setsearchinput] = useState("")

    const [UserRequests, setUserRequests] = useState()
    const [loading, setloading] = useState(false)
    const location = useLocation();
    const dispatch = useDispatch();



    useEffect(() => {
        const name = location.pathname.slice(1).split('/')
        document.title = name[name.length - 1]
    }, [location])

    useEffect(() => {
        if (StoreAllUser.length > 0 && StoreCurrentUser) {
            const thisUser = StoreAllUser.find(user => user._id === StoreCurrentUser._id);

            if (thisUser) {
                const nonFriendUsers = StoreAllUser.filter(user => {
                    const isFriend = thisUser.YourConnections.find(reqObj => reqObj.userId === user._id && reqObj.isFriend);
                    if (isFriend) {
                        return null
                    }
                    return user;
                }).filter(users => users !== null).filter(user => user._id !== StoreCurrentUser._id);

                setOtherUsers(nonFriendUsers);
            }
        }
    }, [StoreCurrentUser, StoreAllUser, searchinput]);


    useEffect(() => {
        if (StoreAllUser.length > 0 && StoreCurrentUser) {

            const thisUser = StoreAllUser.find((user) => user._id === StoreCurrentUser._id)
            if (thisUser) {

                const RequestUsers = thisUser.YourConnections.map((reqObj) => {

                    const userIndex = StoreAllUser.findIndex((user) => user._id === reqObj.userId);
                    if (userIndex !== -1) {
                        const User = StoreAllUser[userIndex]
                        if (!reqObj.isFriend) {
                            return User ? User : null;
                        }
                    }
                    return null
                }).filter(users => users !== null);

                setUserRequests(RequestUsers);
            }
        }
    }, [StoreAllUser, StoreCurrentUser, searchinput]);


    const encryptUserData = (data, secretKey) => {
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);
        return encryptedData.toString();
    }

    const checkIsRequested = (user) => {

        const isALreadyRequested = user.YourConnections.find((req) => req.userId === StoreCurrentUser._id);
        return isALreadyRequested
    }
    const handeluserConnection = (e) => {
        e.preventDefault();
        if (searchinput === "") {
            return
        }
        if (UserRequests && UserRequests.length > 0) {
            setUserRequests(UserRequests.filter((user) => user.username.toLocaleLowerCase().includes(searchinput.toLocaleLowerCase())))
        }
        if (otherUsers && otherUsers.length > 0) {
            setOtherUsers(otherUsers.filter((user) => user.username.toLocaleLowerCase().includes(searchinput.toLocaleLowerCase())))
        }

    }



    return (<>
        <div>
            <div className="my-2 ">
                <p className="my-1 font-semibold text-medium">
                    Search Connections
                </p>
                <form onSubmit={handeluserConnection}>
                    <div className="flex items-center justify-center border-gray-500 border p-2 rounded-md w-4/5 mx-auto bg-white ">

                        <button type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>

                        </button>
                        <input type="search" value={searchinput} onChange={(e) => { setsearchinput(e.target.value) }} placeholder="Search Connections " className="text-cyan-300 text-sm px-1 w-full bg-transparent focus:outline-none focus:ring-0 bg-none rounded-sm " />
                    </div>
                </form>

            </div>

            {
                // UserRequests && UserRequests.length > 0 && otherUsers && otherUsers.length > 0 &&
            }
            {/* < SearchPage UserRequests={UserRequests} otherUsers={otherUsers} /> */}
            <h2 className="font-bold text-lg my-2 text-cyan-500">Members Request </h2>

            <div className="grid  grid-cols-2  gap-2  ">
                {UserRequests && UserRequests.length > 0 ? UserRequests.map((user, index) => {
                    return <div key={index} className="h-80 border bg-white shadow-lg col-span-1  p-1 rounded-lg ">
                        <img src={user.profileImageUrl} alt="img" className="w-full h-28 " style={{ objectFit: "fill", objectPosition: "top center" }} />

                        <div className=" h-24 w-full">
                            <div className="my-1">
                                <h3 className="font-bold text-lg">{user.username}</h3>
                            </div>
                            <p className="text-sm h-auto w-full  flex items-center justify-center p-1 ">
                                {user.primaryMarket}
                            </p>
                        </div>

                        <div onClick={async () => {
                            try {

                                setloading(true)
                                const response = await axios.post(`${serverURL}/api/requestedUser/${user._id}/Accept_Request`, { userId: StoreCurrentUser._id })
                                setloading(false)
                                if (response && response.status === 200) {
                                    const user = encryptUserData(response.data.user, secretEnKey);
                                    localStorage.setItem('REAl_ESTATE_USER_DATA', JSON.stringify({ user, expiration: response.data.user.sessionExpiration }));
                                    dispatch(addToAlusers({ Updateduser: response.data.user }))
                                    dispatch(addToAlusers({ Updateduser: response.data.Otheruser }))
                                    // const newNotification = {
                                    //     MessageHeading: 'Friend Request!',
                                    //     MessageContent: 'A New Member added to your Connections',
                                    //     messageTime: `${new Date()}`,
                                    // }
                                    // dispatch(addnewNotification(newNotification))

                                    dispatch(login(response.data.user))
                                    dispatch(addNotification(response.data.user.Notification));

                                    toast.success(response.data.message);

                                }

                            } catch (error) {
                                setloading(false)
                                if (error) {
                                    if (error.response) {
                                        if (error.response.status === 404) {
                                            toast.info(error.response.data.message);
                                        }
                                        toast.error(error.response.data.message);
                                    }
                                }
                                else {
                                    toast.error("Failed to Acccept  Request");
                                }
                            }

                        }} className="my-2 bg-cyan-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-none py-2">
                            <button>Accept</button>
                        </div>
                        <div onClick={async () => {
                            try {

                                setloading(true)
                                const response = await axios.delete(`${serverURL}/api/requestedUser/${user._id}/Delete_Request/${StoreCurrentUser._id}`)
                                setloading(false)
                                if (response && response.status === 200) {
                                    const user = encryptUserData(response.data.user, secretEnKey);
                                    localStorage.setItem('REAl_ESTATE_USER_DATA', JSON.stringify({ user, expiration: response.data.user.sessionExpiration }));
                                    dispatch(login(response.data.user))
                                    dispatch(addToAlusers({ Updateduser: response.data.user }))
                                    toast.success(response.data.message);

                                }

                            } catch (error) {
                                setloading(false)
                                if (error) {
                                    if (error.response) {
                                        if (error.response.status === 404) {
                                            toast.info(error.response.data.message);
                                        } else {

                                            toast.error(error.response.data.message);
                                        }
                                    }
                                }
                                else {
                                    toast.error("Failed to Acccept  Request");
                                }
                            }
                        }} className="my-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-lg hover:shadow-none py-2">
                            <button>Remove</button>
                        </div>
                    </div>
                })
                    :
                    <div className="my-2 flex items-center justify-center w-full text-center  col-span-2 italic "><p>No Request Found</p></div>
                }


            </div>

            <h2 className="font-bold text-lg my-4 text-cyan-500">Other Members </h2>

            <div className="grid  grid-cols-2  gap-2  ">
                {otherUsers && otherUsers.length > 0 ? otherUsers.map((user, index) => {
                    return <div key={index} className="h-68 border bg-white shadow-lg col-span-1  p-1 rounded-lg ">
                        <img src={user.profileImageUrl} alt="img" className="w-full h-52 " style={{ objectFit: "cover", borderRadius: "1rem" }} />

                        <div className=" h-24 w-full">
                            <div className="my-1">
                                <h3 className="font-bold text-lg">{user.username}</h3>
                            </div>
                            <p className="text-sm h-auto w-full  flex items-center justify-center p-1 ">
                                {user.primaryMarket}
                            </p>
                        </div>

                        <div onClick={async () => {
                            try {

                                const req = checkIsRequested(user)
                                if (req) {
                                    toast.info("Request in Progress")
                                    return
                                }

                                setloading(true)
                                const response = await axios.post(`${serverURL}/api/requestedUser/${user._id}`, { userId: StoreCurrentUser._id })
                                setloading(false)
                                if (response && response.status === 200) {
                                    dispatch(addToAlusers({ Updateduser: response.data.Updateduser }))
                                    toast.success(response.data.message);
                                    // const newNotification = {
                                    //     MessageHeading: 'Friend Request!',
                                    //     MessageContent: 'Request Sent Successfully',
                                    //     messageTime: `${new Date()}`,
                                    // }
                                    // dispatch(addnewNotification(newNotification))
                                }

                            } catch (error) {
                                setloading(false)
                                if (error) {
                                    if (error.response) {
                                        if (error.response.status === 404) {
                                            toast.info(error.response.data.message);
                                        }
                                        toast.error(error.response.data.message);
                                    } else {
                                        toast.error("Failed to Send  Request");
                                    }
                                }
                            }

                        }} className="my-2 bg-cyan-700 cursor-pointer text-white font-semibold rounded-lg shadow-lg hover:shadow-none py-2">

                            <span>{checkIsRequested(user) ? "Requested" : "Request"}</span>

                        </div>

                    </div>
                })
                    :
                    <div>
                        <div className="my-2 flex items-center justify-center w-full text-center  col-span-2 italic "><p>  No Members found</p></div>

                    </div>
                }
            </div>

        </div>
        <Loader loading={loading} />
    </>);
}

