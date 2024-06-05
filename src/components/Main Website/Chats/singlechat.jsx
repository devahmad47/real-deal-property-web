import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { selecteCurrentUser, selectfirebaseChat } from "../../Store/authSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { db } from "../../../firebase";
import { Link } from "react-router-dom";
import {
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    doc,
    updateDoc
} from "firebase/firestore";
export function SingleChat(props) {
    const { roomID } = props
    const StorefireBaseChats = useSelector(selectfirebaseChat)
    const storeCurrentUser = useSelector(selecteCurrentUser)
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState();
    const { showSidebar } = props
    const location = useLocation();
    const [pageTitle, setPageTitle] = useState("");
    const [otherUserData, setotherUserData] = useState(null);


    useEffect(() => {
        setPageTitle(location.pathname.slice(1));
    }, [location.pathname]);

    useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const otheruserObj = StorefireBaseChats.find((chatobj) => chatobj.chatId === roomID);

        if (otheruserObj) {
            const { otherUser } = otheruserObj;
            setotherUserData(otherUser)
        }else{
            setotherUserData(null)

        }
    }, [roomID, StorefireBaseChats]);





    const sendMessage = async (event) => {
        event.preventDefault()

        try {
          
            if (messageInput.trim() === "") {
                return
            }
            setMessageInput("");
            const messagesRef = collection(db, "messages");
            const customDocRef = doc(messagesRef, roomID);
            const chatCollectionRef = collection(customDocRef, "chat");
            const newmesssage = {
                imageUrl: "",
                message: messageInput,
                lastMessageStatus: "seen",
                timestamp: serverTimestamp(),
                senderId: storeCurrentUser._id,
                userName: storeCurrentUser.username,
                profileImageUrl: storeCurrentUser.profileImageUrl,
                type: "text"
            }
            await addDoc(chatCollectionRef, newmesssage);

            // Assuming customDocId is the ID of the document you want to update
            await updateDoc(customDocRef, {
                text: messageInput,
                createdAt: serverTimestamp(),
            });

            // setMessages([...messages, newmesssage]);
        } catch (error) {
            toast.error("unable to send messages")
        }

    };

    useEffect(() => {
        const chatRoomDocRef = doc(db, 'messages', roomID);
        const messagesCollectionRef = collection(chatRoomDocRef, 'chat');
        const messagesQuery = query(messagesCollectionRef, orderBy('timestamp'));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            let messagesM = [];
            snapshot.forEach((doc) => {
                // const data = doc.data();
                // messagesM.push({ ...data, timestamp: data.timestamp.toDate() });
                messagesM.push({ ...doc.data() });
            });
            setMessages(messagesM);
        });
        return () => unsubscribe();
    }, [roomID]);

    useEffect(() => {
        // Scroll to the last message when the component renders or when new messages are added
        scrollToBottom();
    }, [messages]);


    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (<div>

        <div className=" chat-container  relative w-full  mx-auto   ">

            {/* chat Header */}
            {otherUserData &&

                <div style={{ boxShadow: ` 2px 2px 5px rgba(0, 0, 0, 0.2)` }} className="bg-white fixed  p-4 w-full ">
                    <div className="flex items-center justify-between">
                        <Link to={`/page/users/${otherUserData._id}`} className="flex items-center justify-start gap-2">
                            <img src={otherUserData.profileImageUrl} alt="img" className="w-11 h-11 rounded-3xl " />
                            <div>
                                <h2 className="font-bold text-xl">
                                    {otherUserData.username}
                                </h2>
                            </div>
                        </Link>
                    </div>
                </div>
            }

            {/* chatBody */}
            <div className="chatBox  py-20 ">

                {messages && messages.length > 0 &&
                    messages.map((mg, index) => {

                        const milliseconds = mg.timestamp && (mg.timestamp.seconds * 1000 + mg.timestamp.nanoseconds / 1e6);
                        const date = new Date(milliseconds);
                        return <div key={index} className={` flex items-center   ${mg.senderId === storeCurrentUser._id ? 'justify-end ' : 'justify-start'} `}>

                            <div className={` w-2/4 flex items-center  `}>

                                <img src={mg.profileImageUrl} alt="img" className={`w-10 h-10 rounded-3xl  ${mg.senderId === storeCurrentUser._id ? 'order-2 ' : ''} `} />
                                <div key={index} className={` w-full my-2 p-2 mx-2 rounded-md  ${mg.senderId === storeCurrentUser._id ? 'bg-cyan-200 text-end ' : 'bg-green-100 text-start'}`}>

                                    <p>
                                        {mg.message}
                                    </p>
                                    <p className={` text-xs  italic font-semibold   ${mg.senderId === storeCurrentUser._id ? ' text-left' : 'text-end'} `}>
                                        {date && date.toLocaleString()}
                                    </p>

                                </div>
                            </div>
                        </div>
                    })
                }
                <div ref={messagesEndRef} />
                {/* Footer type Message */}
                <div style={{ boxShadow: `0px -2px 3px rgba(0, 0, 0, 0.2)` }} className="bg-white   w-full fixed bottom-0     z-50  py-2 px-4   ">
                    <form

                        onSubmit={sendMessage} className={`grid grid-cols-3   ${showSidebar ? ' grid-cols-3' : 'grid-cols-9'} gap-2`}>
                        <div className={` ${showSidebar ? 'col-span-2' : 'col-span-8'} `}>
                            <input value={messageInput} onChange={(e) => {
                                setMessageInput(e.target.value)
                            }} type="text" placeholder="Say Something....." className=" bg-gray-200 focus:outline-none focus:ring-0 p-2 rounded-md w-full " />
                        </div>
                        <div className=" col-span-1 flex items-center justify-center ">
                            <div className=" w-full  ">
                                <button type="submit">

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>


                    </form>
                </div>
            </div>



        </div>
    </div>)
};



