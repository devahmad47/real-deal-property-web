import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { selecteCurrentUser, selecteUsers } from "../../Store/authSlice";
import { db } from "../../../firebase";
import {
    collection,
    serverTimestamp,
    getDocs,
    setDoc,
    doc
} from "firebase/firestore";


export function MyConnections() {
    const navigate = useNavigate()
    const [YourConnections, setYourConnections] = useState([])
    const [searchinput, setsearchinput] = useState("")

    const StoreAllUser = useSelector(selecteUsers)
    const StoreCurrentUser = useSelector(selecteCurrentUser)
    const location = useLocation()
    const messagesRef = collection(db, "messages");

    useEffect(() => {
        const name = location.pathname.slice(1).split('/')
        document.title = name[name.length - 1]
    }, [location])


    useEffect(() => {
        if (StoreAllUser.length > 0 && StoreCurrentUser) {
           
            const thisUser = StoreAllUser.find((user) => user._id === StoreCurrentUser._id)
            if (thisUser) {

                const YourFriends = thisUser.YourConnections.map((reqObj) => {

                    const userIndex = StoreAllUser.findIndex((user) => user._id === reqObj.userId);
                    if (userIndex !== -1) {
                        const User = StoreAllUser[userIndex]
                        if (reqObj.isFriend) {
                            return User ? User : null;
                        }
                    }
                    return null
                }).filter(users => users !== null);

                setYourConnections(YourFriends);
            }
        }
    }, [StoreAllUser, StoreCurrentUser, searchinput]);

    const handeluserConnection = (e) => {
        e.preventDefault();
        if (searchinput === "") {
            return
        }
        const searchedConnection = YourConnections.filter((user) => user.username.toLocaleLowerCase().includes(searchinput.toLocaleLowerCase()))
        setYourConnections(searchedConnection)

        // setsearchinput("")

    }


    return (<div>
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

        <div className="flex items-center justify-between  gap-2 my-1 bg-cyan-300  p-2 px-4 rounded-lg">

            <h2 className="font-bold text-lg text-cyan-800 ">Friends</h2>
            <h2 className="font-semibold text-medium text-white italic  ">{YourConnections.length} </h2>
        </div>

        <div className="my-2">
            {YourConnections.length > 0 ? YourConnections.map((con, index) => {
                return <div key={index} className="flex my-3 items-center justify-between gap-2  bg-gray-300     rounded-lg p-2 shadow-lg ">
                    <Link to={`/page/users/${con._id}`} className=" cursor-pointer relative flex rounded-full  text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">

                        <img
                            className="h-10 w-10 rounded-full"
                            src={con.profileImageUrl}
                            alt=""
                        />
                    </Link>
                    <Link to={`/page/users/${con._id}`} className="cursor-pointer">
                        <h3 className="font-bold">{con.username}</h3>
                        <p>
                            {con.primaryMarket}
                        </p>
                    </Link>
                    <div className="my-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-none px-2 py-2">
                        <button onClick={async () => {
                            const customDocId = StoreCurrentUser._id + "_" + con._id;

                            const querySnapshot = await getDocs(collection(db, "messages"));
                            let chatExist = false
                            let chatId = ""
                            querySnapshot.forEach((doc) => {
                                if (doc.id.includes(con._id) && doc.id.includes(StoreCurrentUser._id)) {
                                    chatId = doc.id
                                    chatExist = true
                                }
                            });
                            if (chatExist) {
                                // toast.info("chat exist ")
                                navigate(`/Chats/${chatId}`)
                                return
                            }


                            const customDocRef = doc(messagesRef, customDocId);
                            await setDoc(customDocRef, {
                                text: "chat room created",
                                createdAt: serverTimestamp(),
                                senderId: StoreCurrentUser._id,
                                users: [StoreCurrentUser._id, con._id],
                                roomId: customDocId,
                            });
                            navigate(`/Chats/${customDocId}`)



                        }}>Message </button>
                    </div>
                </div>
            })
                :
                <div>
                    <p>
                        No Friends found
                    </p>
                </div>
            }




        </div>

    </div>)
}