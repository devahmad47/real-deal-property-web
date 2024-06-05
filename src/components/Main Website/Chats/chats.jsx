import { ChatHeader } from "./ChatHeader";
import style from "./layout.module.css"
import { useLocation, useParams } from "react-router-dom";
import {  useSelector } from "react-redux";
import {  selectConnections, selectfirebaseChat } from "../../Store/authSlice";
import { useEffect, useState } from "react";
import { Modal } from "../Model/model";
import { SingleChat } from "./singlechat";
import { Loader } from "../Loader/loader";
import { SearchPageModel } from "../connections/searchModel";

export function Chats() {
    const [open, setOpen] = useState(false)
    const StorefireBaseChats = useSelector(selectfirebaseChat)
    const storeAllConnections = useSelector(selectConnections)
        const location = useLocation()
    const [showSidebar, setshowSidebar] = useState(true);
    const [isOpen, setIsOpen] = useState(false)
    const [connections, setconnections] = useState([])
    const [loading, setloading] = useState(false)
    const [chatinfoObj, setchatinfoObj] = useState({
        name: "",
        chatRoomId: ""
    })
    // const [chats, setchats] = useState([]);
    const { roomId } = useParams()
    const [roomID, setRoomID] = useState(null);

    useEffect(() => {
        setRoomID(roomId)
    }, [roomId])
    useEffect(() => {
        setconnections(storeAllConnections)
    }, [storeAllConnections])

    useEffect(() => {
        const name = location.pathname.slice(1).split('/')
        document.title = name[name.length - 1]

    }, [location])

    // useEffect(() => {
    //     const fetchchats = async () => {

    //         const querySnapshot = await getDocs(collection(db, "messages"));
    //         // const querySnapshot = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "asc"))            );
    //         const Allchats = []
    //         querySnapshot.forEach((doc) => {
    //             if (doc.id.includes(storeCurrentUser._id)) {
    //                 Allchats.unshift({
    //                     chatId: doc.id,
    //                     createdAt: doc.data().createdAt.seconds * 1000 + doc.data().createdAt.nanoseconds / 1e6,
    //                 })
    //             }
    //         });
    //         const sortedChats = Allchats.slice().sort((a, b) => b.createdAt - a.createdAt);

    //         const chatedUsers = sortedChats.map(chat => {
    //             const otherUserId = chat.chatId.split('_').find(userid => userid !== storeCurrentUser._id);
    //             const otherUser = StoreAllUser.find(user => user._id === otherUserId);
    //             const otherUserData = {
    //                 chatId: chat.chatId,
    //                 otherUser
    //             }
    //             return otherUserData;
    //         }).filter((user) => user.otherUser !== undefined).filter((user) => user.otherUser._id !== storeCurrentUser._id);

    //         dispatch(allFirebaseChats(chatedUsers))
    //     };
    //     console.log("ok")
    //     if (StoreAllUser.length > 0 && storeCurrentUser) {
    //         console.log("ni aya")
    //         fetchchats();
            
    //     }


    // }, [storeCurrentUser, StoreAllUser, dispatch]);

    return (<div>
        <main>

            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: "3000" }}>
                <ChatHeader showSidebar={showSidebar} setshowSidebar={setshowSidebar} />
            </div>

            <div style={{ height: "100vh", overflowY: "auto", paddingTop: '3.7rem' }} className="grid grid-cols-12  ">

                {/* chat SideBar */}
                <div style={{ boxShadow: ` 5px 5px 10px rgba(0, 0, 0, 0.2)`, height: "100%", overflowY: "auto" }} className={` ${showSidebar ? 'block' : 'hidden'}   fixed md:relative top-14 md:top-0   bg-gray-50   left-0 z-40 w-64 md:w-full md:col-span-3 h-screen  `}>
                    <div className=" w-full">
                        <div className="h-full w-full px-3 pb-4 overflow-y-auto  ">

                            <ul className="space-y-2 font-medium my-3">
                                <button onClick={() => {
                                    setOpen(true)
                                }} className=" w-full py-2 hover:bg-blue-300 bg-cyan-400 hover:shadow-none shadow-md  rounded-md ">
                                    New Chat
                                </button>

                                {StorefireBaseChats && StorefireBaseChats.length > 0 && StorefireBaseChats.map((chatobj, index) => (
                                    <div key={index} >
                                        <li className={`flex ${chatobj.chatId === roomID ? "bg-cyan-100" : ""} items-center justify-between my-2 hover:bg-gray-200 hover:shadow-none shadow-md  rounded-md px-2 py-3`}>
                                            <div onClick={async () => {
                                                setRoomID(chatobj.chatId)
                                                // setotherUserData({ userName: chatobj.otherUser.username, profileImageUrl: chatobj.otherUser.profileImageUrl })

                                            }} className="font-bold flex cursor-pointer items-center justofy-start gap-2">
                                                <div>
                                                    <img src={chatobj.otherUser.profileImageUrl} alt="img" className="w-8 h-8 rounded-3xl " />
                                                </div>
                                                <span>
                                                    {chatobj.otherUser.username}
                                                </span>
                                            </div>
                                            <span onClick={() => {
                                                setchatinfoObj((pre) => ({ ...pre, name: chatobj.otherUser.username }))
                                                setchatinfoObj((pre) => ({ ...pre, chatRoomId: chatobj.chatId }))
                                                setIsOpen(true)
                                            }} className="inline-flex cursor-pointer items-center justify-center  ml-3 text-sm font-medium ">
                                                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                </svg> */}
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>

                                            </span>
                                        </li>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>



                {/* chat Screen */}
                <div style={{ height: "100%", overflowY: "auto" }} className={`col-span-12      ${style.heightScroll}   ${showSidebar ? ' md:col-span-9' : 'col-span-12'}   `}>
                    {StorefireBaseChats && StorefireBaseChats.length > 0 && roomID ?
                        <div className="chatbody">

                            <SingleChat roomID={roomID} showSidebar={showSidebar} />
                        </div>
                        :
                        <div className="w-full h-full  flex items-center justify-center">
                            <h2 className="font-bold text-xl">Select a chat</h2>
                        </div>
                    }
                </div>
            </div>
        </main >

        < Modal setloading={setloading} name={chatinfoObj.name} roomID={chatinfoObj.chatRoomId} isOpen={isOpen} setIsOpen={setIsOpen} />
        <Loader loading={loading} setloading={setloading} />
        {open &&
            <SearchPageModel open={open} setOpen={setOpen} connections={connections} />
        }
    </div>)
};

