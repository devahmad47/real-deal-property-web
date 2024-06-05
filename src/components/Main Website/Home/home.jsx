// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState, } from "react";
import Select from 'react-select'
import { useDispatch, useSelector } from "react-redux";
import { selecteAllPost, addAllposts, selecteCurrentUser } from "../../Store/authSlice";
import { Loader } from "../Loader/loader";
import { Posts } from "../PostComponent/postComponent";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const serverURL = process.env.REACT_APP_SERVER_URL

export function Home() {
    const StoreAllPosts = useSelector(selecteAllPost)
    const storeCurrentUser = useSelector(selecteCurrentUser)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const intialFilterData = {
        FilterTypes: "",
        invesmentTypes: "",
        price: 0,
        builtYear: 0
    }
    const [filterData, setFilterData] = useState(intialFilterData)
    const [loading, setloading] = useState(false)

    const FilterTypes = [
        { value: "Newest Listing", label: "Date: Newest Listing" },
        { value: "Oldest Listing", label: "Date: Oldest Listing" },
        { value: "Low to High", label: "Price: Low to High" },
        { value: "High to Low", label: "Price: High to Low" },
        { value: "Newest", label: "Built Year: Newest" },
        { value: "Oldest", label: "Built Year: Oldest" },
    ]
    const invesmentTypes = [
        { value: "Buy and hold", label: "Buy and hold" },
        { value: "Subto", label: "Subto" },
        { value: "Fix N' Flip", label: "Fix N' Flip" },
        // { value: "Wholesale", label: "Wholesale" },
    ]

    const [filteredPosts, setFilteredPosts] = useState(StoreAllPosts);

    useEffect(() => {
        setFilteredPosts(StoreAllPosts)
    }, [StoreAllPosts])

    useEffect(() => {
        document.title = 'Home'
    }, [])

    const loadPostData = async () => {
        console.log("aya")
        setFilterData(intialFilterData)
        if (storeCurrentUser) {
            try {
                const response = await axios.get(`${serverURL}/api/posts/get_post`)
                if (response && response.status === 200) {
                    // console.log(response.data.posts)
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

    const filtered_Posts = async (e) => {
        e.preventDefault()
        // setFilterData(e.value);
        try {
            // const response = await axios.post(`${serverURL}/api/posts/filtered_Post`, { filterQuery: e.value })
            // console.log(filterData)
            setloading(true)
            const response = await axios.post(`${serverURL}/api/posts/filtered_Post`, filterData)
            setloading(false)
            if (response && response.status === 200) {
                // console.log(response.data.posts)
                toast.success(response.data.message);
                // console.log(response.data.posts)
                dispatch(addAllposts(response.data.posts))
            }


        } catch (error) {
            setloading(false);
            if (error && error.response) {

                toast.error(error.response.data.message)
            } else {
                toast.error("Failed to Filter Post");
            }

        }


    }


    return (<div >

        {/* create Post */}

        <form onSubmit={filtered_Posts} className="grid grid-cols-8 gap-2 my-2">

            <div className="col-span-2 flex items-center justify-center">
                <Select
                    onChange={(e) => { setFilterData((pre) => ({ ...pre, FilterTypes: e.value })) }}
                    className={` w-full z-50 `} options={FilterTypes}
                />

            </div>
            <div className="col-span-2  flex items-center justify-center">
                <Select
                    onChange={(e) => { setFilterData((pre) => ({ ...pre, invesmentTypes: e.value })) }}
                    className={` w-full z-50 `} options={invesmentTypes}
                />

            </div>
            <div className="col-span-2  ">

                <input
                    type="number"
                    value={filterData.price}
                    onChange={(e) => { setFilterData((pre) => ({ ...pre, price: e.target.value })) }}
                    className={` w-full z-50 h-full rounded-md px-2`} placeholder="Min Price"
                />

            </div>
            <div className="col-span-2  ">

                <input
                    type="number"
                    value={filterData.builtYear}
                    onChange={(e) => { setFilterData((pre) => ({ ...pre, builtYear: e.target.value })) }}
                    className={` w-full z-50 h-full rounded-md px-2`} placeholder="Built year"
                />

            </div>
            <button type="submit" className="col-span-6 text-white  hover:bg-cyan-300 p-2 rounded-md shadow-md hover:shadow-none bg-cyan-500  ">
                <span >
                    Filter
                </span>

            </button>
            <span onClick={loadPostData} className="col-span-2 cursor-pointer text-white  hover:bg-cyan-300 p-2 rounded-md shadow-md hover:shadow-none bg-cyan-500  ">
                Clear

            </span>

        </form>

        <div >

            <button onClick={() => {
                navigate("/page/create_post/home")
            }} className=" mx-auto  rounded my-2  px-2 sm:px-6 lg:px-4 py-2  bg-white flex items-center w-full justify-between gap-2 p-2   shadow-md hover:shadow-none hover:bg-cyan-500 hover:text-white  cursor-pointer">
                <p className="font-semibold">
                    Create a Post
                </p>
                <div>
                    <img src="/photoDoc.svg" alt="img" className="w-5 h-5 " />
                </div>
            </button>
        </div>


        <Posts deleteWhat={"HomePost"} filteredPosts={filteredPosts} />
        <Loader loading={loading} />
    </div >)
}

