import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selecteAllPost, } from "../../Store/authSlice";
import { useParams } from "react-router-dom";

import { Posts } from "../PostComponent/postComponent";

export function Sharedpost() {
    const StoreAllPosts = useSelector(selecteAllPost)
    const [sharedPost, setSharedPost] = useState([])
    const { postID } = useParams()

    useEffect(() => {
        const Post = StoreAllPosts.find((post) => post._id === postID);
        if (Post) {

            setSharedPost([Post])
        }
    }, [StoreAllPosts, postID])

    useEffect(() => {
        document.title = 'Home'
    }, [])


    return (<div>

        <Posts deleteWhat={"HomePost"} filteredPosts={sharedPost} />
    </div>)
}