import { Outlet } from "react-router-dom";
import { Header } from "../Header/header";
import style from "./layout.module.css"
import { SideBarAd } from "../sideBars/adPage";
import { SidepageTabs } from "../sideBars/pagesTabs";
import { selecteCurrentUser, selectAllAds, allAdsStore, selecteAllPost, addAllposts, selecteGroupList, addAllGroup, allusers, selecteUsers } from "../../Store/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const serverURL = process.env.REACT_APP_SERVER_URL


export const FulllayoutMainWeb = () => {
    const storeAllUsers = useSelector(selecteUsers)
    const StoreGroups = useSelector(selecteGroupList)
    const StoreAllPosts = useSelector(selecteAllPost)
    const storeAllAds = useSelector(selectAllAds)
    const storeCurrentUser = useSelector(selecteCurrentUser)

    const dispatch = useDispatch()

    useEffect(() => {
        const loadgroupsData = async () => {

            if ((!StoreGroups.length > 0) && (storeCurrentUser)) {
                try {
                    const response = await axios.get(`${serverURL}/api/groups/get_groups`)
                    if (response && response.status === 200) {
                        dispatch(addAllGroup(response.data.groups))
                    }
                } catch (error) {
                    if (error) {
                        if (error.response) {
                            toast.error(error.response.data.message);

                        } else {
                            toast.error("Unable to Load Posts Data");
                        }
                    }
                }
            }

        }
        if (!StoreGroups.length > 0) {

            loadgroupsData()
        }
    }, [StoreGroups, storeCurrentUser, dispatch])

    useEffect(() => {
        const loadPostData = async () => {

            if (!(StoreAllPosts.length > 0) && (storeCurrentUser)) {
                try {
                    const response = await axios.get(`${serverURL}/api/posts/get_post`)
                    if (response && response.status === 200) {
                        dispatch(addAllposts(response.data.posts))
                    }
                } catch (error) {
                    if (error) {
                        if (error.response) {
                            toast.error(error.response.data.message);

                        } else {
                            toast.error("Unable to Load Posts Data");
                        }
                    }
                }
            }

        }
        loadPostData()
    }, [StoreAllPosts, dispatch, storeCurrentUser])

    useEffect(() => {
        const loadAllUser = async () => {

            if ((!storeAllUsers.length > 0) && (storeCurrentUser)) {

                try {
                    const response = await axios.get(`${serverURL}/api/users/get_all_users`)
                    if (response && response.status === 200) {
                        dispatch(allusers(response.data.users))
                    }
                } catch (error) {
                    if (error) {
                        if (error.response) {

                            toast.error(error.response.data.message);
                        } else {
                            toast.error("Unable to Load ALL Users");
                        }
                    }
                }
            }

        }
        if (!storeAllUsers.length > 0) {

            loadAllUser()
        }
    }, [storeAllUsers, storeCurrentUser, dispatch])

    useEffect(() => {

        async function getAds() {
            try {

                const response = await axios.get(`${serverURL}/api/tasks/get-All-tasks`)
                if (response && response.status === 200) {
                    dispatch(allAdsStore(response.data.Ads))
                    // toast.success(response.data.message)
                }
            } catch (error) {
                if (error.response) {

                    if (error.response.status === 401) {
                        toast.error(error.response.data.message);
                    } else if (error.response.status === 400) {
                        toast.error(error.response.data.message);
                    } else if (error.response.status === 500) {
                        toast.error(error.response.data.message);
                    }

                } else {
                    toast.error("Failed to Fetch Pinned  Posts");
                }

            }
        }
        if (!(storeAllAds.length > 0)) {
            getAds()
        }


    }, [dispatch, storeAllAds])


    return (
        <main>

            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: "3000" }}>
                <Header />
            </div>

            <div style={{ marginTop: "3.5rem" }} >

                <div style={{ height: "89vh" }} className={` grid grid-cols-1  bg-gray-200  md:grid-cols-4  text-center`}>

                    {/* column 1 */}
                    <div className={`  ${style.heightScroll} col-span-1 hidden md:block  bg-white  py-4 px-2 `}>
                        <SidepageTabs />
                    </div>

                    {/* column 2 */}
                    <div className={` ${style.heightScroll2}  col-span-2 py-2  px-2`}   >
                        <Outlet />
                    </div>


                    {/* column 3 */}
                    <div className={` ${style.heightScroll}  col-span-1 hidden md:block py-2 px-2`} >
                        <SideBarAd />
                    </div>

                </div>
            </div>
        </main >
    );
};

