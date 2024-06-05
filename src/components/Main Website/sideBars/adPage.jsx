import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { selectAllAds, selectfirebaseChat } from "../../Store/authSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

export function SideBarAd() {
    const storeAllAds = useSelector(selectAllAds)
    const StorefireBaseChats = useSelector(selectfirebaseChat)

    const [visibleChatShortcuts, setVisibleChatShortcuts] = useState([]);


    useEffect(() => {
        setVisibleChatShortcuts(StorefireBaseChats.slice(0, 3))
    }, [StorefireBaseChats])
    const removeChatShortcut = (index) => {
        const updatedChatShortcuts = [...visibleChatShortcuts];
        updatedChatShortcuts.splice(index, 1);

        // if (AllChatShortcuts.length > visibleChatShortcuts.length) {
        //     updatedChatShortcuts.push(AllChatShortcuts[visibleChatShortcuts.length]);
        // }

        setVisibleChatShortcuts(updatedChatShortcuts)
    };


    return (<div>

        {
            storeAllAds && storeAllAds.length > 0 &&
            <div>

                <div className="bg-white rounded-lg my-1  p-2">
                    <h2 className=" font-bold text-lg text-cneter">
                        Advertisment
                    </h2>
                </div>

                <div className={`  carosoal  `}>
                    <Swiper

                        modules={[Autoplay, Pagination, Navigation]}
                        // navigation
                        // pagination={{ clickable: true }}
                        autoplay={{
                            delay: 20000,
                            disableOnInteraction: true,

                            pauseOnMouseEnter: true
                        }}
                        spaceBetween={20}
                        slidesPerView={1}
                        className="mySwiper p-2"  >
                        {
                            storeAllAds.map((eachitem, index) => (
                                <SwiperSlide
                                    key={index} className="" style={{ width: "100%", cursor: "pointer" }}>
                                    <div className="bg-white rounded-lg p-2 my-2 ">
                                        <img src={eachitem.adsImageUrl} alt="img" className="w-full h-32" />
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-left font-semibold my-1">{eachitem.adsDiscription}</h2>
                                        </div>
                                    </div>

                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>

            </div>
        }

        <div className=" my-2 ">
            {visibleChatShortcuts && visibleChatShortcuts.length > 0 && visibleChatShortcuts.map((shortcut, index) => (
                <div key={index} className="grid grid-cols-5  gap-2" >

                    <Link to={`/Chats/${shortcut.chatId}`} style={{ boxShadow: ` 5px 5px 10px rgba(0, 0, 0, 0.2)` }} className=" col-span-4 bg-white cursor-pointer my-1 grid grid-cols-5 place-items-center gap-2 rounded-lg p-3 ">

                        <div className=" col-span-5 lg:col-span-1 flex rounded-full bg-gray-800 text-sm  items-center justify-between ">
                            <img
                                className="h-10 w-10 rounded-full"
                                src={shortcut.otherUser.profileImageUrl}
                                alt="chatuserImage"
                            />
                        </div>


                        <div className="col-span-5 lg:col-span-3">
                            <h5 className="font-bold italic ">{shortcut.otherUser.username}</h5>
                            {/* <div className="flex text-sm  items-center justify-start gap-1">
                                <p className="italic text-blue-600">
                                    {shortcut.MessageCount} Message from {shortcut.UserName}
                                </p>
                            </div> */}
                        </div>

                        <div className="col-span-5 lg:col-span-1">
                            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h4.59l-2.1 1.95a.75.75 0 001.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 10-1.02 1.1l2.1 1.95H6.75z" clipRule="evenodd" />
                            </svg> */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="blue" className="bi bi-dot" viewBox="0 0 16 16">
                                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                            </svg>
                        </div>
                    </Link>

                    {/* cross Svg */}
                    <div className="col-span-1 flex items-center justify-center cursor-pointer ">
                        <svg onClick={() => removeChatShortcut(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                </div>
            ))}

        </div>
    </div>
    )
}