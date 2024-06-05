import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNotification, postReactionF, selecteAllPost, addPostComment, updateUser, selecteCurrentUser, addDiscussionPostComment, postReactiondiscussionPost } from "../../Store/authSlice";
import DeleteModel from "../modelDelete/modelDelete";
import { Loader } from "../Loader/loader";
import SharedModel from "../SharedModel/sharedModel";
import { toast } from "react-toastify";
import axios from "axios";
import styles from "./post.module.css"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import { Pagination, Autoplay, Navigation } from "swiper/modules";
import CryptoJS from 'crypto-js';
import { Link } from "react-router-dom";
const serverURL = process.env.REACT_APP_SERVER_URL
const secretEnKey = process.env.REACT_APP_SECRET_ENC_KEY

export function Posts(props) {
    const StoreAllPosts = useSelector(selecteAllPost)
    const StoreCurrentUser = useSelector(selecteCurrentUser)
    const dispatch = useDispatch()
    const [deleteA, setDeleteA] = useState(false)
    const [SharePostOpen, setSharePostOpen] = useState(false)
    const [SharedpostID, setSharedpostID] = useState('')
    const [deletedId, setdeletedId] = useState('')
    const [mobileNumber, setmobileNumber] = useState('+923306146540')

    const [UserComment, setUserComment] = useState('')
    const [loading, setloading] = useState(false)

    useEffect(() => {
        setmobileNumber(StoreCurrentUser.mobileNumber)
    }, [StoreCurrentUser.mobileNumber])

    const [commentsOpen, setcommentsOpen] = useState(StoreAllPosts.map(() => false));

    const toggleCommentSectionOpen = (index) => {
        const updatedStates = [...commentsOpen];
        updatedStates[index] = !updatedStates[index];
        setcommentsOpen(updatedStates);
    };

    const [postDetailOpen, setpostDetailOpen] = useState(StoreAllPosts.map(() => false));

    const togglePostDetailOpen = (index) => {
        const updatedStates = [...postDetailOpen];
        updatedStates[index] = !updatedStates[index];
        setpostDetailOpen(updatedStates);
    };

    const [dots, setdots] = useState(StoreAllPosts.map(() => false));
    const toggledotsOpen = (index) => {
        const updatedStates = [...dots];
        updatedStates[index] = !updatedStates[index];
        setdots(updatedStates);
    };

    // const myReaction = (reactionArray) => {
    //     const like = reactionArray.find(rec => rec.ReactorId === StoreCurrentUser._id)
    //     if (like) {
    //         return true
    //     } else {
    //         return false
    //     }
    // }
    const myReaction = (reactionArray) => {
        if (!Array.isArray(reactionArray)) {
            return false; // Return false if reactionArray is not an array
        }
        if (reactionArray.length <= 0) {
            return false;
        }
        const like = reactionArray.filter((rec) => rec !== null).find(rec => rec.ReactorId === StoreCurrentUser._id);
        return Boolean(like); // Convert to boolean and return
    };



    const encryptUserData = (data, secretKey) => {
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);
        return encryptedData.toString();
    }
    const issavedpost = (postId,) => {
        const isSaved = StoreCurrentUser.Savedposts.some(
            (savedPost) => savedPost.postId === postId
        );
        return isSaved ? true : false

    }



    return (<div>
        {props.filteredPosts && props.filteredPosts.length > 0 ?
            props.filteredPosts.map((post, index) => {
                return <div key={index} className="mx-auto bg-white rounded my-2 w-full  px-2  py-2 sm:px-6 lg:px-4">

                    <div className="flex items-center justify-between">

                        <div className="flex items-center justify-start">
                            <Link to={`/page/posts/${post._id}`} className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <img
                                    className="h-10 w-10 rounded-full"
                                    src={post.userProfileImageSrc}
                                    alt="src"
                                />
                            </Link>
                            <div className="mx-2">
                                <h5 className="text-left">{post.postedBy}</h5>
                                <div className="flex text-sm  items-center justify-start gap-1">
                                    <span>{post.postCreated.slice(0, 10)}</span>
                                    {/* <img src="/world.svg" alt="img" /> */}
                                </div>
                            </div>
                        </div>
                        <div onClick={() => { toggledotsOpen(index) }} className="cursor-pointer relative">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                            </svg>
                            {
                                dots[index] &&
                                <div style={{ boxShadow: ` 5px 5px 10px rgba(0, 0, 0, 0.2)`, left: "-6rem" }} className="absolute z-50 px-2 w-32 bg-gray-200   top-6   ">

                                    <p onClick={async () => {
                                        try {

                                            setloading(true)
                                            const response = await axios.post(`${serverURL}/api/posts/reportPost/${post._id}`, { userId: StoreCurrentUser._id })
                                            setloading(false)
                                            if (response && response.status === 200) {
                                                console.log(response)
                                                toast.success(response.data.message);

                                            }

                                        } catch (error) {
                                            setloading(false)
                                            if (error) {
                                                // console.log(error)
                                                if (error.response) {
                                                    toast.error(error.response.data.message);

                                                } else {
                                                    toast.error("Failed to Report Post");
                                                }
                                            }
                                        }
                                    }} className="px-1 my-1   flex items-center justify-between hover:bg-blue-500 hover:text-white py-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z" clipRule="evenodd" />
                                        </svg>
                                        Report


                                    </p>
                                    <p
                                        onClick={async () => {
                                            try {
                                                // const newSavePost = {
                                                //     postId: post._id,
                                                //     postDescription: post.postDescription,
                                                //     CreatorID: post.CreatorID,
                                                //     postDealType: post.postDealType,
                                                //     mediaTypes: post.mediaTypes,
                                                //     mediaUrls: post.mediaUrls,
                                                //     Price: post.Price,
                                                //     location: post.location,
                                                //     postedBy: post.postedBy,
                                                //     userProfileImageSrc: post.userProfileImageSrc,
                                                // }

                                                const isAlreadySaved = issavedpost(post._id)
                                                if (isAlreadySaved) {
                                                    setloading(true)
                                                    const response = await axios.delete(`${serverURL}/api/posts/remove-post-from-savedposts/${StoreCurrentUser._id}/${post._id}`)
                                                    setloading(false)
                                                    if (response && response.status === 200) {
                                                        toast.success(response.data.message);
                                                        dispatch(updateUser(response.data.user))
                                                        const user = encryptUserData(response.data.user, secretEnKey);
                                                        dispatch(addNotification(response.data.user.Notification));

                                                        localStorage.setItem('REAl_ESTATE_USER_DATA', JSON.stringify({ user, expiration: response.data.user.sessionExpiration }));
                                                    }
                                                    return
                                                }

                                                setloading(true)
                                                const response = await axios.post(`${serverURL}/api/posts/savepost/${StoreCurrentUser._id}`, { postId: post._id, groupId: props.groupId, isDiscussionPost: props.deleteWhat === 'Discussionpost' ? true : false })
                                                setloading(false)
                                                if (response && response.status === 200) {
                                                    toast.success(response.data.message);
                                                    dispatch(updateUser(response.data.user))
                                                    const user = encryptUserData(response.data.user, secretEnKey);
                                                    dispatch(addNotification(response.data.user.Notification));

                                                    localStorage.setItem('REAl_ESTATE_USER_DATA', JSON.stringify({ user, expiration: response.data.user.sessionExpiration }));

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
                                                        toast.error("Failed to Save Post");
                                                    }
                                                }
                                            }
                                        }}
                                        className="px-2 my-1 border-y border-gray-500  flex items-center justify-between hover:bg-blue-500 hover:text-white py-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                                        </svg>
                                        {
                                            issavedpost(post._id) ? "Unsave" : "Save"
                                        }


                                    </p>
                                    {StoreCurrentUser._id === post.CreatorID &&

                                        <p onClick={() => {
                                            setDeleteA(true)
                                            setdeletedId(post._id)
                                        }} className="px-2 my-1  flex items-center justify-between hover:bg-blue-500 hover:text-white py-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>

                                            Delete
                                        </p>
                                    }
                                </div>
                            }

                        </div>
                    </div>
                    <p className="my-2 text-center  text-sm">
                        {post.postDescription}
                    </p>

                    <button onClick={() => {
                        togglePostDetailOpen(index)
                    }} className="p-2 font-semibold hover:shadow-md w-full bg-cyan-500 text-white rounded-md flex items-center justify-between">
                        <span>
                            Deal Details
                        </span>
                        <span>
                            {postDetailOpen[index] ?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
                                </svg>

                                :
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>}
                        </span>
                    </button>
                    {
                        postDetailOpen[index] &&
                        <div className=" rounded-br-lg rounded-bl-lg  p-2 bg-gray-300">
                            <div className=" flex items-center justify-between p-1">
                                <span className="font-bold">
                                    Price
                                </span>
                                <span className="italic">
                                    {post.Price} $
                                </span>
                            </div>
                            <div className=" flex items-center justify-between p-1">
                                <span className="font-bold">
                                    Estimated_Rents
                                </span>
                                <span className="italic">
                                    {post.Estimated_Rents} $
                                </span>
                            </div>
                            <div className=" flex items-center justify-between p-1">
                                <span className="font-bold">
                                    Built Year
                                </span>
                                <span className="italic">
                                    {post.YearBuilt}
                                </span>
                            </div>
                            <div className=" flex items-center justify-between p-1">
                                <span className="font-bold">
                                    City,State - ZipCode
                                </span>
                                <span className="italic">
                                    {post.city + " " + post.state + "-" + post.zipCode}
                                </span>
                            </div>

                            <div className=" flex items-center justify-between p-1">
                                <span className="font-bold">
                                    DwellingStyle
                                </span>
                                <span className="italic">
                                    {post.DwellingStyle}
                                </span>
                            </div>
                            <div className=" flex items-center justify-between p-1">
                                <span className="font-bold">
                                    No Of Bedromoms
                                </span>
                                <span className="italic">
                                    {post.NoOfBedromoms}
                                </span>
                            </div>
                            <div className=" flex items-center justify-between p-1">
                                <span className="font-bold">
                                    No Of Bathrooms
                                </span>
                                <span className="italic">
                                    {post.NoOfBathrooms}
                                </span>
                            </div>
                            <div className=" flex items-center justify-between p-1">
                                <span className="font-bold">
                                    C. O. E.
                                </span>
                                <span className="italic">
                                    {post.close_of_Escrow}
                                </span>
                            </div>
                            <div className=" flex items-center justify-between p-1">
                                <span className="font-bold">
                                    Pool
                                </span>
                                <span className="italic">
                                    {post.Pool}
                                </span>
                            </div>
                            <div className=" flex items-center justify-between p-1">
                                <span className="font-bold">
                                    Basement
                                </span>
                                <span className="italic">
                                    {post.Basement}
                                </span>
                            </div>
                            <div className=" flex items-center justify-between p-1">
                                <span className="font-bold">
                                    Repair Needs
                                </span>
                                <span className="italic">
                                    {post.Repair_Needs}
                                </span>
                            </div>
                            <div className=" flex items-center justify-between p-1">
                                <span className="font-bold">
                                    HAO Feature
                                </span>
                                <span className="italic">
                                    {post.HAO_Feature}
                                </span>
                            </div>
                            {post.Monthly_PMT &&
                                <div className=" flex items-center justify-between p-1">
                                    <span className="font-bold">
                                        Monthly PMT
                                    </span>
                                    <span className="italic">
                                        {post.Monthly_PMT}
                                    </span>
                                </div>
                            }


                        </div>
                    }
                    <div className="my-3 relative ">


                        <div className={`  carosoal `}>
                            <Swiper

                                modules={[Autoplay, Pagination, Navigation]}
                                // navigation
                                pagination={{ clickable: true }}
                                autoplay={{
                                    delay: 2000,
                                    disableOnInteraction: true,

                                    pauseOnMouseEnter: true
                                }}



                                spaceBetween={20}
                                slidesPerView={1}
                                className="mySwiper p-2"  >
                                {
                                    post.mediaUrls.map((eachitem, index) => (
                                        <SwiperSlide
                                            key={index} className={`${styles.InnerSlide}`}>
                                            <div className="position-relative">
                                                {post.mediaTypes[index].includes('image') ?
                                                    <div >
                                                        <img src={eachitem} alt="img" className="rounded-lg h-72 w-full  " />
                                                        <div className="absolute top-2 left-0 flex items-center justify-between px-4  w-full    text-white font-bold text-xl ">
                                                            <h2>{post.postDealType}</h2>
                                                            <h2>{post.Price} $</h2>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div   >
                                                        <div>
                                                            <video style={{ objectFit: "cover", borderRadius: "10px" }} width="100%" className="h-72" controls>
                                                                <source src={eachitem} type="video/mp4" />
                                                            </video>

                                                        </div>
                                                        <div className="absolute top-2 left-0 flex items-center justify-between px-4  w-full    text-white font-bold text-xl ">
                                                            <h2>{post.postDealType}</h2>
                                                            <h2>{post.Price} $</h2>
                                                        </div>
                                                    </div>
                                                }

                                            </div>
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>

                        {/* {post.mediaType.includes('image') ?
                            <div >
                                <img src={post.mediaUrl} alt="img" className="rounded-lg h-72 w-full  " />
                                <div className="absolute top-2 left-0 flex items-center justify-between px-4  w-full    text-white font-bold text-xl ">
                                    <h2>{post.postDealType}</h2>
                                    <h2>{post.Price} $</h2>
                                </div>
                            </div>
                            :
                            <div   >
                                <div>
                                    <video style={{ objectFit: "cover", borderRadius: "10px" }} width="100%" className="h-72" controls>
                                        <source src={post.mediaUrl
                                        } type="video/mp4" />
                                    </video>

                                </div>
                                <div className="absolute top-2 left-0 flex items-center justify-between px-4  w-full    text-white font-bold text-xl ">
                                    <h2>{post.postDealType}</h2>
                                    <h2>{post.Price} $</h2>
                                </div>
                            </div>
                        } */}

                    </div>

                    <div className="flex items-center justify-between  p-2 my-2">
                        <div>
                            <div className="flex items-center justify-center gap-1">
                                <img src="/like.svg" alt="img" className="w-6 h-6 " />
                                {/* <img src="/heart.svg" alt="img" className="w-6 h-6 " /> */}
                                <span>
                                    {post.postReactions && post.postReactions.length}
                                </span>
                            </div>
                        </div>
                        <div>

                            <div className="flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                </svg>
                                <span>
                                    {post.comments && post.comments.length}
                                </span>


                            </div>
                        </div>
                    </div>

                    <div className="border-t-2 border-gray-200 flex items-center justify-between my-1 py-2   gap-1">
                        <div
                            onClick={async () => {
                                const reactionsArray = post.postReactions || []; // Ensure post.postReactions is an array

                                const reaction = !(myReaction(reactionsArray))
                                const userReaction = {
                                    ReactorId: StoreCurrentUser._id,
                                    ReactionAdded: `${new Date()}`,
                                    ReactionUserName: StoreCurrentUser.username,
                                }

                                try {
                                    setloading(true)
                                    if (props.deleteWhat === "Discussionpost") {
                                        const response = await axios.post(`${serverURL}/api/groupsPost/discussionPost/${props.groupId}/reaction/${post._id}`, { reaction, userReaction })
                                        setloading(false)
                                        if (response && response.status === 200) {
                                            toast.success(response.data.message);
                                            dispatch(postReactiondiscussionPost({ groupId: props.groupId, postId: post._id, reaction, userReaction }))

                                        }
                                    } else {
                                        const response = await axios.post(`${serverURL}/api/posts/${post._id}/reaction`, { reaction, userReaction })
                                        setloading(false)
                                        if (response && response.status === 200) {
                                            toast.success(response.data.message);
                                            dispatch(postReactionF({ postId: post._id, reaction, userReaction, post }))
                                        }
                                    }
                                } catch (error) {
                                    setloading(false)
                                    if (error) {
                                        if (error.response) {
                                            toast.error(error.response.data.message);
                                        } else {
                                            toast.error("Failed to Update Reaction");
                                        }
                                    }
                                }


                            }
                            }
                            className="w-full relative text-center flex items-center justify-center cursor-pointer hover:bg-gray-200  p-2 rounded-lg">
                            {
                                myReaction(post.postReactions) ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="blue" className="w-6 h-6">
                                    <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                                </svg>

                            }


                        </div>

                        <div onClick={() => { toggleCommentSectionOpen(index) }} className="w-full text-center flex items-center justify-center cursor-pointer hover:bg-gray-200 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>

                        </div>
                        <div onClick={() => {
                            setSharedpostID(post._id)
                            setSharePostOpen(true)
                            // alert(post._id)
                        }} className="w-full text-center flex items-center justify-center cursor-pointer hover:bg-gray-200 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                            </svg>

                        </div>
                    </div>
                    {
                        commentsOpen[index] && <div className="bg-white my-1 border-t-2 border-gray-200">
                            <div className="flex items-center justify-between gap-2">
                                <img
                                    src={post.userProfileImageSrc}
                                    alt="CommentUser"
                                    style={{ width: "3rem", height: "2.4rem ", objectFit: "cover", borderRadius: "90%" }}
                                />
                                <div style={{ width: "100%", padding: ".75rem 1.5rem" }}>
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            const currentDate = new Date()
                                            const commentCreated = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
                                                .toString()
                                                .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

                                            const newComment = {
                                                commentPostedBy: StoreCurrentUser.username,
                                                userProfilePicture: StoreCurrentUser.profileImageUrl,
                                                commentCreated,
                                                UserComment,
                                                postId: post._id,
                                                userId: StoreCurrentUser._id,
                                            };


                                            if (props.deleteWhat === "Discussionpost") {

                                                try {
                                                    setloading(true)
                                                    const response = await axios.post(`${serverURL}/api/groupsPost/discussionPost/${props.groupId}/add_comments/${post._id}`, { newComment })
                                                    setloading(false)
                                                    if (response && response.status === 200) {
                                                        toast.success(response.data.message);
                                                        dispatch(addDiscussionPostComment({ groupId: props.groupId, postId: post._id, comment: newComment }));

                                                    }
                                                } catch (error) {
                                                    setloading(false)
                                                    if (error) {
                                                        if (error.response) {
                                                            toast.error(error.response.data.message);
                                                        } else {
                                                            toast.error("Failed to Add Comment");
                                                        }
                                                    }
                                                }
                                            } else {


                                                try {
                                                    setloading(true)
                                                    const response = await axios.post(`${serverURL}/api/posts/${post._id}/comments`, { newComment })
                                                    setloading(false)
                                                    if (response && response.status === 200) {
                                                        toast.success(response.data.message);
                                                        dispatch(addPostComment({ _id: post._id, comment: newComment }));

                                                    }
                                                } catch (error) {
                                                    setloading(false)
                                                    if (error) {
                                                        if (error.response) {
                                                            toast.error(error.response.data.message);
                                                        } else {
                                                            toast.error("Failed to Add Comment");
                                                        }
                                                    }
                                                }
                                            }


                                            setUserComment('')


                                        }}
                                        className="flex items-center justify-between gap-2 p-1 bg-gray-100 rounded-lg "
                                    >
                                        <input
                                            name="textarea"
                                            type="text"
                                            rows={1}
                                            value={UserComment}
                                            onChange={(e) => {
                                                setUserComment(e.target.value)
                                            }}
                                            placeholder="Write a comment"
                                            className="w-full bg-transparent p-2 focus:outline-none focus:ring-0"
                                        />
                                        <button
                                            type="submit"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                            </svg>
                                        </button>
                                    </form>
                                </div>

                            </div>

                            {post.comments && post.comments.length > 0 ? <div className={`px-6  ${styles.commentMessage} `}>
                                {post.comments.map((eachcomment, index) => {
                                    return <div key={index} className={` flex items-center   `}>

                                        <div className={` w-3/5 flex items-center  `}>

                                            {eachcomment.userProfilePicture && <img src={eachcomment.userProfilePicture} alt="img" className={`w-10 h-10 rounded-3xl `} />}
                                            <div key={index} className="bg-gray-100 rounded-md my-2 p-1 text-left px-2 w-full">
                                                <p className=" flex items-center justify-between my-1">
                                                    <Link to={`/page/users/${eachcomment.userId}`} className="font-semibold ">
                                                        {eachcomment.commentPostedBy}
                                                    </Link>
                                                    <span className="font-semibold text-sm italic">
                                                        {eachcomment.commentCreated}
                                                    </span>
                                                </p>
                                                <p className="text-gray-500">
                                                    {eachcomment.UserComment}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                })}

                            </div> :
                                <div><p>No Comments yet</p></div>
                            }
                        </div>

                    }

                </div>
            })
            :

            <div className="flex items-center justify-center my-2 py-2 px-2 font-bold w-full"><p>Add a New Post </p></div>
        }
        <DeleteModel groupId={props.groupId} deleteWhat={props.deleteWhat} deletedId={deletedId} heading={"Delete Post"} bodyContent={`Are you sure you  to delete Post? This action cannot be undone.`} buttonContent={"Delete"} deleteA={deleteA} setDeleteA={setDeleteA} />


        <Loader loading={loading} />
        <SharedModel mobileNumberm={mobileNumber} SharePostOpen={SharePostOpen} setSharePostOpen={setSharePostOpen} SharedpostID={SharedpostID} />

    </div>)
}