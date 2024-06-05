import { useState, useEffect } from "react";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import style from "./login.module.css";

import { Loader } from "../Loader/loader";
import { useRef } from "react";
const serverURL = process.env.REACT_APP_SERVER_URL

export function SingupWebsite() {
  const location = useLocation();

  const DateRef = useRef();
  const DayRef = useRef();
  const YearRef = useRef();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordfalse, setpasswordfalse] = useState(false);
  const intialData = {
    email: "",
    password: "",
    confirmpassword: "",
    firstName: "",
    lastName: "",
    primaryMarket: "",
    date: "",
    month: "",
    year: "",
    profileImage: "",
    mobileNumber: ""

  }
  const [signupData, setsignupData] = useState(intialData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setsignupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  async function handelSubmit(e) {
    e.preventDefault();

    if (signupData.confirmpassword !== signupData.password) {
      toast.info("Password didn't Match")
      return
    }
    if (!(signupData.date && signupData.month && signupData.year)) {
      setpasswordfalse(true)
      toast.info("choose all the fields")
      return
    }
    setpasswordfalse(false)
    const formData = new FormData();
    formData.append('username', signupData.firstName + " " + signupData.lastName);
    formData.append('email', signupData.email);
    formData.append('mobileNumber', signupData.mobileNumber);
    formData.append('password', signupData.password);
    formData.append('primaryMarket', signupData.primaryMarket);
    formData.append('DOB', signupData.date + "-" + signupData.month + "-" + signupData.year);
    formData.append('profileImage', signupData.profileImage);




    try {
      setLoading(true);
      const response = await axios.post(`${serverURL}/api/auth/register_User`, formData);

      if (response) {
        if (response.status === 200) {
          setLoading(false);
          toast.success("Email Verification Link has been sent to you");
          // dispatch(addToVerifyUser(response.data.user));
          navigate(`/Login`);

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

    // setsignupData(intialData)
  }
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const Dateoptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

  const Monthoptions = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const Yearoptions = [1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]


  useEffect(() => {
    const name = location.pathname.slice(1).split('/')
    document.title = name[name.length - 1]

  }, [location])


  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <Link to={"/Login"} className="sm:mx-auto my-4 sm:w-full sm:max-w-sm">
          <img
            className="mx-auto  h-16  w-auto"
            src="/Real Deal Exchange_Name_White.png"
            alt="Your Company"
          />

        </Link>
        <div
          style={{ boxShadow: ` 5px 5px 10px rgba(0, 0, 0, 0.2)` }}
          className="mt-2 sm:mx-auto border  p-4 rounded-lg sm:w-full sm:max-w-sm"
        >
          <div className="my-2">

            <h2 className="text-center font-bold text-2xl">
              Create an account
            </h2>
            <h4 className="text-center text-sm text-gray-500  ">It's quick and easy </h4>
          </div>
          <form
            onSubmit={handelSubmit}
            className="space-y-6"

          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name *
              </label>
              <div className="mt-2 flex items-center gap-2 justify-between">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={signupData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="First Name"
                  className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={signupData.lastName}
                  onChange={handleInputChange}
                  placeholder="LastName"
                  required
                  className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>


            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address *
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={signupData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  required
                  className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone Number *
              </label>
              <div className="mt-2">
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="mobileNumber"
                  value={signupData.mobileNumber}
                  onChange={handleInputChange}
                  required
                  className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>



            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password1"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password *
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password1"
                  name="password"
                  type="password"
                  value={signupData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  required
                  className={` ${passwordfalse ? `border-red-500` : ""} block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password *
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password2"
                  name="confirmpassword"
                  type="password"
                  value={signupData.confirmpassword}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  required
                  className={` ${passwordfalse ? `border-red-500` : ""} block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="ProfileImage"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Upload profile Image *
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="ProfileImage"
                  name="ProfileImage"
                  type="file"
                  onChange={(e) => {
                    setsignupData(((pre) => ({ ...pre, profileImage: e.target.files[0] })))

                  }}
                  required
                  className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Primary Market *
                </label>
              </div>
              <div className="mt-2">
                <input
                  id=""
                  name="primaryMarket"
                  type="text"
                  value={signupData.primaryMarket}
                  onChange={handleInputChange}
                  // placeholder="Enter Primary Market Name"
                  required
                  className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>

              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Date of Birth *
                </label>
              </div>

              <div className="mt-2 flex items-center justify-between ">




                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button ref={DayRef} className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      Month
                      <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Menu.Button>
                  </div>

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
                        {Monthoptions.map((date, index) => {
                          return <Menu.Item key={index}>
                            {({ active }) => (
                              <span
                                onClick={(e) => {
                                  const DayT = e.target.innerText
                                  DayRef.current.innerText = DayT
                                  setsignupData((predata) => ({ ...predata, month: DayT }))

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
                </Menu>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button ref={DateRef} className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      Date
                      <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Menu.Button>
                  </div>

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
                                  setsignupData((predata) => ({ ...predata, date: DateT }))
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
                </Menu>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button ref={YearRef} className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      Year
                      <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Menu.Button>
                  </div>

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
                                  setsignupData((predata) => ({ ...predata, year: YearT }))

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
                </Menu>


              </div>
            </div>




            {/* <div className="my-2 text-sm font-light">
              <p className="my-1 ">People who use our service may have uploaded your contact information to Facebook.  <Link className="text-cyan-500" to={"/learnMore"}>Learn more</Link>.</p>

              <p className="text-xs">
                By clicking Sign Up, you agree to our Terms, <Link className="text-cyan-500" to={"/policy"}> Privacy Policy and Cookies Policy </Link>. You may receive SMS notifications from us and can opt out at any time.

                Sign Up
              </p>
            </div> */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-cyan-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            already have an account?{" "}
            <Link to={"/Login"}

              className="font-semibold leading-6 text-cyan-300 hover:text-indigo-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <Loader loading={loading} />
    </>
  );
}
