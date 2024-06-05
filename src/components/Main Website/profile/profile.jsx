import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { selecteCurrentUser } from "../../Store/authSlice";
import { useSelector, useDispatch } from "react-redux";
// import { Fragment } from 'react'
// import { Menu, Transition } from '@headlessui/react'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'
// import style from "./profile.module.css"
import DeleteModel from "../modelDelete/modelDelete";
import axios from "axios";
import { Loader } from "../Loader/loader";
import { toast } from "react-toastify";

import { updateUser } from "../../Store/authSlice";
import CryptoJS from 'crypto-js';
const serverURL = process.env.REACT_APP_SERVER_URL
const secretEnKey = process.env.REACT_APP_SECRET_ENC_KEY

export function Profile() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [deleteA, setDeleteA] = useState(false)
    const [updatePictrueOpen, setupdatePictrueOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [profileImage, setprofileImage] = useState('')
    const [disableEdit, setedisableEdit] = useState(true)
    // const [emailEdit, setemailEdit] = useState(ProfileData.isemailverified)
    // const [showpassword, setshowpassword] = useState(false);

    const storeCurrentUser = useSelector(selecteCurrentUser)
    const [ProfileData, setProfileData] = useState(storeCurrentUser)
    const location = useLocation()
    // const DateRef = useRef();
    // const DayRef = useRef();
    // const YearRef = useRef();
    // function classNames(...classes) {
    //     return classes.filter(Boolean).join(' ')
    // }


    const encryptUserData = (data, secretKey) => {
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);
        return encryptedData.toString();
    }


    // const Dateoptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

    // const Dayoptions = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // const Yearoptions = [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]


    useEffect(() => {
        const name = location.pathname.slice(1).split('/')
        document.title = name[name.length - 1]
    }, [location])

    const [userName, setUserName] = useState({
        firstName: storeCurrentUser.username.split(" ")[0],
        lastName: storeCurrentUser.username.split(" ")[1],
    })

    const handleInputChange = (e) => {
        // setemailEdit(true)
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const verification = searchParams.get('verification');

        if (verification === 'success') {
            toast.success('Email verification successful');

        } else if (verification === 'error') {
            toast.error('Email verification Failed');

        }
    }, [location.search]);

    const verifyEmail = async () => {
        try {
            setLoading(true);

            const response = await axios.post(`${serverURL}/api/auth/verify/updateEmail`, { email: ProfileData.email, UserID: ProfileData._id });
            setLoading(false);

            if (response) {
                if (response.status === 200) {
                    setLoading(false);
                    toast.success("Email Verification has been sent!");

                    localStorage.removeItem('REAl_ESTATE_USER_DATA');
                    navigate("/Login")
                    // dispatch(updateUser(response.data.user))
                    // const user = encryptUserData(response.data.user, secretEnKey);
                    // localStorage.setItem('REAl_ESTATE_USER_DATA', JSON.stringify({ user, expiration: response.data.user.sessionExpiration }));

                }
            }
        } catch (error) {
            setLoading(false);

            if (error) {

                if (error.response) {
                   
                    toast.error(error.response.data.message);

                } else {
                    toast.error("Failed to Verify Email");
                }
            }
        }
    }

    const UpdateProfile = async () => {
        if (!profileImage) {
            toast.info("Select Profile Image")
        }
        const formData = new FormData();
        formData.append('profileImage', profileImage);
        formData.append('userId', storeCurrentUser._id);
        try {
            setLoading(true);
            const response = await axios.post(`${serverURL}/api/auth/update_profile`, formData);
            setLoading(false);

            if (response) {
                if (response.status === 200) {
                    setLoading(false);
                    toast.success("Profile Picture Updated");
                    dispatch(updateUser(response.data.user))
                    const user = encryptUserData(response.data.user, secretEnKey);
                    localStorage.setItem('REAl_ESTATE_USER_DATA', JSON.stringify({ user, expiration: response.data.user.sessionExpiration }));

                }
            }
        } catch (error) {
            setLoading(false);

            if (error) {

                if (error.response) {
                    
                    toast.error(error.response.data.message);

                } else {
                    toast.error("Failed to Singup");
                }
            }
        }

    }

    return (<div>



        <div
            // onSubmit={(e) => {
            //     e.preventDefault();
            //     if (!(ProfileData.date && ProfileData.day && ProfileData.year)) {
            //         alert("choose all the feilds")
            //         return
            //     }
            // }}
            className="bg-cyan-100 rounded-xl shadow-lg  p-2"
        >

            <div className="flex items-center justify-between gap-2">

                <h2 className="font-bold text-lg   text-cyan-800">Your Profile </h2>
                <button onClick={() => { setedisableEdit(!disableEdit) }} className="font-bold text-lg   text-cyan-800">Edit </button>
            </div>

            <div className="grid grid-cols-2 gap-2 my-4  ">

                {/* detail div */}
                <div className="order-3 md:order-1 col-span-2 md:col-span-1  ">

                    {/* <div className="text-left flex items-center my-2 justify-between">
                        <h2 className="font-bold">
                            id

                        </h2>
                        <h2>
                            {storeCurrentUser._id}
                        </h2>
                    </div> */}
                    <div className="text-left block lg:flex items-center my-2 justify-between">
                        <h2 className="font-bold mr-2 my-2">
                            Email

                        </h2>
                        <div className="flex items-center justify-between" >
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={ProfileData.email}
                                onChange={handleInputChange}
                                autoComplete="email"
                                className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <button className={`mx-2 bg-blue-500 text-white p-1 px-2 rounded-md ${ ProfileData.isemailverified ? "cursor-not-allowed" : "cursor-pointer "}    `}  onClick={verifyEmail}>
                                {ProfileData.isemailverified ? "Verified" : "Verify"}
                            </button>
                        </div>

                    </div>
                    <div className="text-left block lg:flex items-center my-2 justify-between">
                        <h2 className="font-bold ">
                            UserName

                        </h2>

                        {disableEdit ? <h2 className="text-center italic">
                            {storeCurrentUser.username}
                        </h2> : <div className="mt-2 flex items-center gap-2  justify-between">
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={userName.firstName}
                                onChange={(e) => {
                                    setUserName((pre) => ({ ...pre, firstName: e.target.value }))
                                }}
                                placeholder="First Name"
                                className="block w-full  p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <input

                                id="lastName"
                                name="lastName"
                                type="text"
                                value={userName.lastName}
                                onChange={(e) => {
                                    setUserName((pre) => ({ ...pre, lastName: e.target.value }))
                                }} placeholder="Surname"
                                className="block w-full p-1   rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>}
                    </div>


                    <div className="text-left block lg:flex items-center my-2 justify-between">
                        <h2 className="font-bold">
                            Market Title

                        </h2>
                        {disableEdit ?
                            <h2 className="italic text-center">
                                {storeCurrentUser.primaryMarket}
                            </h2>
                            :
                            <div >
                                <input

                                    id=""
                                    name="primaryMarket"
                                    type="text"
                                    value={ProfileData.primaryMarket}
                                    onChange={handleInputChange}
                                    // placeholder="Enter Primary Market Name"
                                    required
                                    className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>}
                    </div>
                    <div className="text-left block lg:flex items-center my-2 justify-between">
                        <h2 className="font-bold">
                            Mobile Number

                        </h2>
                        {disableEdit ?
                            <h2 className="italic text-center">
                                {storeCurrentUser.mobileNumber && storeCurrentUser.mobileNumber }
                            </h2>
                            :
                            <div >
                                <input

                                    id=""
                                    name="mobileNumber"
                                    type="text"
                                    value={ProfileData.mobileNumber}
                                    onChange={handleInputChange}
                                    // placeholder="Enter Primary Market Name"
                                    required
                                    className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>}
                    </div>
                    <div className="text-left block lg:flex  items-center  my-2 justify-between">
                        <h2 className="font-bold">
                            Date of birth

                        </h2>
                        {disableEdit ?
                            <h2 className="italic text-center">
                                {storeCurrentUser.DOB}
                            </h2>
                            :
                            <div >
                                <input
                                    id=""
                                    name="DOB"
                                    type="date"
                                    value={ProfileData.DOB}
                                    onChange={handleInputChange}
                                    // placeholder="Enter Primary Market Name"
                                    required
                                    className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>}

                    </div>
                    {!disableEdit &&
                        <button onClick={async () => {
                            const formData = new FormData();
                            // formData.append('profileImage', profileImage);
                            formData.append('username', userName.firstName + " " + userName.lastName);
                            formData.append('primaryMarket', ProfileData.primaryMarket);
                            formData.append('mobileNumber', ProfileData.mobileNumber);
                            formData.append('userId', ProfileData._id);
                            formData.append('DOB', ProfileData.DOB);
                            try {
                                setLoading(true);
                                const response = await axios.post(`${serverURL}/api/auth/update_profile`, formData);
                                setLoading(false);

                                if (response) {
                                    if (response.status === 200) {
                                        setLoading(false);
                                        toast.success("Profile  Updated");

                                        dispatch(updateUser(response.data.user))
                                        const user = encryptUserData(response.data.user, secretEnKey);
                                        localStorage.setItem('REAl_ESTATE_USER_DATA', JSON.stringify({ user, expiration: response.data.user.sessionExpiration }));

                                    }
                                }
                            } catch (error) {
                                setLoading(false);

                                if (error) {

                                    if (error.response) {
                                     
                                        toast.error(error.response.data.message);

                                    } else {
                                        toast.error("Failed to Singup");
                                    }
                                }
                            }
                        }} className="bg-cyan-500 text-white w-full  rounded-md p-1 "> Update Profile</button>
                    }
                </div>

                {/* picture did */}
                <div className="  order-1 md:order-2 flex items-center justify-center md:justify-end  p-2  col-span-2 md:col-span-1 ">
                    <div className=" relative border-2 border-black rounded-3xl  w-32 h-32  ">
                        <img src={storeCurrentUser.profileImageUrl} style={{ width: "100%", height: "100%" }} className="object-cover rounded-3xl" alt="img" />
                        <button onClick={() => { setupdatePictrueOpen(!updatePictrueOpen) }} style={{ bottom: "-.5rem", zIndex: "5000" }} className="absolute z-10 text-white  right-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </button>
                    </div>
                </div>
                {updatePictrueOpen &&
                    <div className="order-2  px-2 md:order-3 my-4 flex items-center justify-between   col-span-2">

                        <input type="file" accept="images/*" name="profileImage" id="profileImage" onChange={(e) => { setprofileImage(e.target.files[0]) }} />
                        <button onClick={UpdateProfile} className="font-semibold px-2 text-lg   text-white bg-cyan-500 rounded-md">Upload </button>
                    </div>}
            </div>
        </div>

        {/* <div className="flex items-center justify-between px-2">

            <h2 className="font-bold text-left text-lg  text-cyan-800">Settings & Preferences </h2>


        </div> */}

        {/* <div className=" my-4 p-2 bg-cyan-100 rounded-xl shadow-lg ">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!(ProfileData.date && ProfileData.day && ProfileData.year)) {
                        alert("choose all the feilds")
                        return
                    }
                }}
                className="space-y-6"

            >
                <div >
                    <label
                        htmlFor="name"
                        className="block text-sm  text-left font-bold leading-6 text-gray-900"
                    >
                        Name
                    </label>
                    <div className="mt-2 flex items-center gap-2  justify-between">
                        <input
                            readOnly={disableEdit}
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={ProfileData.username.split(" ")[0]}
                            onChange={handleInputChange}
                            required
                            placeholder="First Name"
                            className="block w-full shadow-xl  p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <input
                            readOnly={disableEdit}
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={ProfileData.username.split(" ")[1]}
                            onChange={handleInputChange}
                            placeholder="Surname"
                            required
                            className="block w-full p-1 shadow-xl  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2  gap-2">

                    <div className="col-span-2 md:col-span-1">
                        <label
                            htmlFor="email"
                            className="block text-sm font-bold text-left leading-6 text-gray-900"
                        >
                            Email address
                        </label>
                        <div >
                            <input
                                readOnly={disableEdit}
                                id="email"
                                name="email"
                                type="email"
                                value={ProfileData.email}
                                onChange={handleInputChange}
                                autoComplete="email"
                                required
                                className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-bold leading-6 text-gray-900"
                            >
                                Password
                            </label>
                        </div>
                        <div className="mt-2 relative">
                            <input
                                readOnly={disableEdit}
                                id="password"
                                name="password"
                                type={showpassword ? 'text' : 'password'}
                                value={ProfileData.password}
                                onChange={handleInputChange}
                                autoComplete="current-password"
                                required
                                className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <div onClick={() => { setshowpassword(!showpassword) }} className="absolute right-3 top-2 cursor-pointer  ">
                                {showpassword ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2  gap-2">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="ProfileImage"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Upload profile Image
                            </label>
                        </div>
                        <div >
                            <input
                                //    readOnly={disableEdit}
                                disabled={disableEdit}
                                id="ProfileImage"
                                name="ProfileImage"
                                type="file"
                                onChange={(e) => {
                                    setProfileData(((pre) => ({ ...pre, ProfileImage: e.target.files[0] })))

                                }}
                                required
                                className="block w-full bg-white p-1 rounded-md  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Primary Market
                            </label>
                        </div>
                        <div >
                            <input
                                readOnly={disableEdit}

                                id=""
                                name="primaryMarket"
                                type="text"
                                value={ProfileData.primaryMarket}
                                onChange={handleInputChange}
                                // placeholder="Enter Primary Market Name"
                                required
                                className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>
                <div>

                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Date of Birth
                        </label>
                    </div>

                    <div className="mt-2 flex items-center justify-between ">


                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button ref={DateRef} className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    {ProfileData.DOB.split("-")[0]}
                                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                </Menu.Button>
                            </div>

                            {!disableEdit &&
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className={` ${style.scrollHeight} absolute right-0 z-10 mt-2 p-2 w-16 h-60  origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
                                        <div className={`py-1   `}>
                                            {Dateoptions.map((date, index) => {
                                                return <Menu.Item key={index}>
                                                    {({ active }) => (
                                                        <span
                                                            onClick={(e) => {
                                                                const DateT = e.target.innerText
                                                                DateRef.current.innerText = DateT
                                                                setProfileData((predata) => ({ ...predata, date: DateT }))
                                                            }}
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block text-left px-1 py-2 text-sm'
                                                            )}
                                                        >
                                                            {date}
                                                        </span>
                                                    )}
                                                </Menu.Item>
                                            })}

                                        </div>
                                    </Menu.Items>
                                </Transition>}
                        </Menu>

                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button ref={DayRef} className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    {ProfileData.DOB.split("-")[1]}
                                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                </Menu.Button>
                            </div>
                            {!disableEdit &&
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className={` ${style.scrollHeight} absolute right-0 z-10 mt-2 w-24 p-2 h-60  origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
                                        <div className={`py-1   `}>
                                            {Dayoptions.map((date, index) => {
                                                return <Menu.Item key={index}>
                                                    {({ active }) => (
                                                        <span
                                                            onClick={(e) => {
                                                                const DayT = e.target.innerText
                                                                DayRef.current.innerText = DayT
                                                                setProfileData((predata) => ({ ...predata, day: DayT }))

                                                            }}
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block text-left px-1 py-2 text-sm'
                                                            )}
                                                        >
                                                            {date}
                                                        </span>
                                                    )}
                                                </Menu.Item>
                                            })}

                                        </div>
                                    </Menu.Items>
                                </Transition>
                            }
                        </Menu>

                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button ref={YearRef} className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    {ProfileData.DOB.split("-")[2]}
                                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                </Menu.Button>
                            </div>
                            {!disableEdit &&
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className={` ${style.scrollHeight} absolute right-0 z-10 mt-2 w-24 p-2 h-60  origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
                                        <div className={`py-1   `}>
                                            {Yearoptions.map((date, index) => {
                                                return <Menu.Item key={index}>
                                                    {({ active }) => (
                                                        <span
                                                            onClick={(e) => {
                                                                const YearT = e.target.innerText
                                                                YearRef.current.innerText = YearT
                                                                setProfileData((predata) => ({ ...predata, year: YearT }))

                                                            }}
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block text-left px-1 py-2 text-sm'
                                                            )}
                                                        >
                                                            {date}
                                                        </span>
                                                    )}
                                                </Menu.Item>
                                            })}

                                        </div>
                                    </Menu.Items>
                                </Transition>
                            }
                        </Menu>


                    </div>
                </div>





                <div>
                    <button
                        style={{ display: disableEdit ? 'none' : 'block' }}
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-cyan-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Update profile
                    </button>
                </div>
            </form>
        </div > */}

        <h2 className="font-bold text-lg text-left my-2  text-cyan-800">Delete Profile </h2>
        <button onClick={() => {
            setDeleteA(true)
        }} className="w-full px-4 py-2 bg-red-600 font-semibold text-white rounded-md shadow-lg hover:shadow-none my-1">
            Delete
        </button>

        <DeleteModel heading={"Deactivate account"} bodyContent={"Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone."} buttonContent={"Deactivate"} deleteA={deleteA} setDeleteA={setDeleteA} />
        <Loader loading={loading} />
    </div >)
}