import React from "react";
import { useEffect } from "react";
import { selecteUsers , selecteCurrentUser } from "../../Store/authSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { db } from "../../../firebase";
import {
    collection,
    serverTimestamp,
    getDocs,
    setDoc,
    doc
} from "firebase/firestore";


export function Oprofile() {
    const navigate = useNavigate()
    const { userId } = useParams()
    const storeAllusers = useSelector(selecteUsers)
    const StoreCurrentUser = useSelector(selecteCurrentUser)
    const [thisUser, setThisUser] = useState(null)
    const messagesRef = collection(db, "messages");

    useEffect(() => {
        const Userprofile = storeAllusers.find((users) => users._id === userId)
        setThisUser(Userprofile)
    }, [storeAllusers, userId])

    return (<div>


        <div className="bg-cyan-100 rounded-xl shadow-lg my-2 p-2">

            <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold text-lg center  text-cyan-800">User Profile </h2>
            </div>
            {thisUser &&
                <div className="grid grid-cols-2 gap-2 my-4  ">

                    <div className="order-3 md:order-1 col-span-2 md:col-span-1  ">



                        <div className="text-left block lg:flex items-center my-2 justify-between">
                            <h2 className="font-bold mr-2 my-2">
                                Email

                            </h2>
                            <h2 className="text-center italic">
                                {thisUser.email}
                            </h2>

                        </div>

                        <div className="text-left block lg:flex items-center my-2 justify-between">
                            <h2 className="font-bold ">
                                UserName

                            </h2>

                            <h2 className="text-center italic">
                                {thisUser.username}
                            </h2>
                        </div>


                        <div className="text-left block lg:flex items-center my-2 justify-between">
                            <h2 className="font-bold">
                                Market Title

                            </h2>

                            <h2 className="italic text-center">
                                {thisUser.primaryMarket}
                            </h2>

                        </div>
                        <div className="text-left block lg:flex items-center my-2 justify-between">
                            <h2 className="font-bold">
                                Mobile Number

                            </h2>

                            <h2 className="italic text-center">
                                {thisUser.mobileNumber && thisUser.mobileNumber}
                            </h2>

                        </div>

                    </div>

                    <div className="  order-1 md:order-2 flex items-center justify-center md:justify-end  p-2  col-span-2 md:col-span-1 ">
                        <div className=" relative border-2 border-black rounded-3xl  w-32 h-32  ">
                            <img src={thisUser.profileImageUrl} style={{ width: "100%", height: "100%" }} className="object-cover rounded-3xl" alt="img" />

                        </div>
                    </div>


                </div>
            }
            <div className="text-left block lg:flex items-center px-2 my-2 justify-between">
                <h2 className="font-bold">
                    Contact
                </h2>

                <div className="my-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-none px-2 py-2">
                    <button onClick={async () => {
                        const customDocId = StoreCurrentUser._id + "_" + userId;

                        const querySnapshot = await getDocs(collection(db, "messages"));
                        let chatExist = false
                        let chatId = ""
                        querySnapshot.forEach((doc) => {
                            if (doc.id.includes(userId) && doc.id.includes(StoreCurrentUser._id)) {
                                chatId = doc.id
                                chatExist = true
                            }
                        });
                        if (chatExist) {
                            // toast.info("chat exist ")
                            navigate(`/Chats/${chatId}?`)
                            return
                        }


                        const customDocRef = doc(messagesRef, customDocId);
                        await setDoc(customDocRef, {
                            text: "chat room created",
                            createdAt: serverTimestamp(),
                            senderId: StoreCurrentUser._id,
                            users: [StoreCurrentUser._id, userId],
                            roomId: customDocId,
                        });
                        navigate(`/Chats/${customDocId}?`)



                    }}>Message </button>
                </div>

            </div>
        </div>

    </div >)
}