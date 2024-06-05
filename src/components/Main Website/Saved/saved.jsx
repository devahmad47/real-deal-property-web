import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selecteCurrentUser, selecteAllPost, selecteGroupList } from "../../Store/authSlice";

import { useState } from "react";
import { Posts } from "../PostComponent/postComponent";

// import { Link } from "react-router-dom";
// const WebSite_Domain = process.env.REACT_APP_WEB_DOMAIN

export function Saved() {
    const [savedPost, setsavedPost] = useState([])
    const storeCurrentUser = useSelector(selecteCurrentUser)
    const storeAllPosts = useSelector(selecteAllPost)
    const storeGroupList = useSelector(selecteGroupList)
    const location = useLocation()
    useEffect(() => {
        const name = location.pathname.slice(1).split('/')
        document.title = name[name.length - 1]

    }, [location])



    useEffect(() => {
        const AllsavedPost = storeCurrentUser.Savedposts.map((Savedposts) => {
            if (Savedposts.isDiscussionPost) {
                const groupIndex = storeGroupList.findIndex((group) => group._id === Savedposts.groupId);
                if (groupIndex !== -1) {
                    const Dispost = storeGroupList[groupIndex].groupDicussionsPost.find(post => post._id === Savedposts.postId);
                    // Check if Dispost is defined before returning
                    return Dispost ? Dispost : null;
                }
            } else {
                const Post = storeAllPosts.find((post) => post._id === Savedposts.postId);
                // Check if Post is defined before returning
                return Post ? Post : null;
            }
            return null
        }).filter(post => post !== null); // Filter out undefined posts

        setsavedPost(AllsavedPost);
    }, [storeCurrentUser.Savedposts, storeGroupList, storeAllPosts]);

    return (<>
        <h2 className="font-bold  text-center my-2 text-cyan-400 text-2xl">
            Saved Posts
        </h2>
        {savedPost && savedPost.length > 0 ? <Posts deleteWhat={"HomePost"} filteredPosts={savedPost} /> : <p className="font-semibold  text-center">
            No post found
        </p>
        }
        {/* here is old code     */}
    </>)
}

// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "swiper/css/autoplay";
// import { Pagination, Autoplay, Navigation } from "swiper/modules";
// import styles from "./saved.module.css"

// <div>
//     <h3 className="my-2 font-bold text-xl text-cyan-600">Saved Items</h3>
//     {savedPost && savedPost.map((sav, index) => {
//         return <div
//             // to={`${WebSite_Domain}/page/posts/${sav.postId}`}
//             key={index} className="my-4 bg-white p-2 cursor-pointer rounded-lg flex grid grid-cols-2 gap-2 ">

//             <div className="col-span-2 ">

// <div className={`  carosoal `}>
//     <Swiper

//         modules={[Autoplay, Pagination, Navigation]}
//         // navigation
//         pagination={{ clickable: true }}
//         autoplay={{
//             delay: 2000,
//             disableOnInteraction: true,

//             pauseOnMouseEnter: true
//         }}



//         spaceBetween={20}
//         slidesPerView={1}
//         className="mySwiper p-2"  >
//         {
//             sav.mediaUrls.map((eachitem, index) => (
//                 <SwiperSlide
//                     key={index} className={`${styles.InnerSlide}`}>
//                     <div className="position-relative">
//                         {sav.mediaTypes[index].includes('image') ?
//                             <div >
//                                 <img src={eachitem} alt="img" className="rounded-lg h-72 w-full  " />
//                                 <div className="absolute top-2 left-0 flex items-center justify-between px-4  w-full    text-white font-bold text-xl ">
//                                     <h2>{sav.postDealType}</h2>
//                                     <h2>{sav.Price} $</h2>
//                                 </div>
//                             </div>
//                             :
//                             <div   >
//                                 <div>
//                                     <video style={{ objectFit: "cover", borderRadius: "10px" }} width="100%" className="h-72" controls>
//                                         <source src={eachitem} type="video/mp4" />
//                                     </video>

//                                 </div>
//                                 <div className="absolute top-2 left-0 flex items-center justify-between px-4  w-full    text-white font-bold text-xl ">
//                                     <h2>{sav.postDealType}</h2>
//                                     <h2>{sav.Price} $</h2>
//                                 </div>
//                             </div>
//                         }

//                     </div>
//                 </SwiperSlide>
//             ))
//         }
//     </Swiper>
// </div>
//                 {/* {sav.mediaType.includes("image") ?
//                 <img src={sav.mediaUrl} alt="ssavedPostImage" className="h-40 w-full rounded-md" />
//                 :
//                 <video style={{ objectFit: "cover", borderRadius: "10px" }} width="100%" className="h-40 " controls>
//                     <source src='/b.mp4' type="video/mp4" />
//                 </video>
//             } */}

//             </div>
//             <div className="text-left  col-span-2   ">
//                 {/* <div className="my-2 flex items-center justify-between px-2 gap-2">

//                 <h1 className="font-semibold ">{sav.postDealType}</h1>
//                 <h1 className="font-semibold italic">{sav.Price} $</h1>
//             </div> */}

//                 <h2 className="my-1 text-lg text-left ">
//                     {sav.postDescription}
//                 </h2>
//             </div>
//         </div>
//     })}

// </div>