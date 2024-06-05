import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
// import { useDispatch, useSelector } from 'react-redux';
// import { login, selecteVerifyUser } from '../../Store/authSlice';
import { Loader } from "../Loader/loader";
// import CryptoJS from 'crypto-js';
const serverURL = process.env.REACT_APP_SERVER_URL
// const secretEnKey = process.env.REACT_APP_SECRET_ENC_KEY


export function VerifyEmail() {
    const { token, id } = useParams()
    const location = useLocation();
    let navigate = useNavigate();
    // const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [newPasssword, setnewPasssword] = useState('');
    const [ConfirmPasssword, setConfirmPasssword] = useState('');


    useEffect(() => {
        const name = location.pathname.slice(1).split('/')
        document.title = name[name.length - 1]

    }, [location])


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const verification = searchParams.get('verification');

        if (verification === 'success') {
            toast.success('Email verification successful');
            // const storedData = localStorage.getItem('REAl_ESTATE_USER_DATA');
            // if (storedData) {
            //     navigate("/page/Profile?verification=success")
            // }
        } else if (verification === 'error') {
            toast.error('Email verification Failed');

        }
    }, [location.search, navigate]);



    async function handelSubmit(e) {


        e.preventDefault();
        if (ConfirmPasssword !== newPasssword) {
            toast.info("Password Not matched")
        }
        try {
            setLoading(true)
            const response = await axios.post(`${serverURL}/api/auth/${token}/forgotPassword`, { userId: id, password: newPasssword });

            setLoading(false)

            if (response) {

                if (response.status === 200) {
                    toast.success(response.data.message)
                    // const user = encryptUserData(response.data.user, secretEnKey);
                    // localStorage.setItem('REAl_ESTATE_USER_DATA', JSON.stringify({ user, expiration: response.data.user.sessionExpiration }));
                    // dispatch(login(response.data.user));
                    navigate("/Login")
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


    // const encryptUserData = (data, secretKey) => {
    //     const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);
    //     return encryptedData.toString();
    // }

    return (<>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <Link to={"/Login"} className="sm:mx-auto my-4 sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-16  w-auto"
                    src="/Real Deal Exchange_Name_White.png"
                    alt="Your Company"
                />

            </Link>
            <div style={{ boxShadow: ` 5px 5px 10px rgba(0, 0, 0, 0.2)` }} className="mt-2 sm:mx-auto border  p-4 rounded-lg sm:w-full sm:max-w-sm">
                <form onSubmit={handelSubmit} className="space-y-6" >

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                New Password
                            </label>

                        </div>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="text"

                                placeholder="new  password"
                                autoComplete="current-password"
                                value={newPasssword}
                                required
                                onChange={(e) => { setnewPasssword(e.target.value) }}

                                className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Confirm Password
                            </label>

                        </div>
                        <div className="mt-2">
                            <input
                                id="CPassword"
                                name="CPassword"
                                type="text"
                                placeholder="Enter OTP"
                                autoComplete="current-password"
                                value={ConfirmPasssword}
                                onChange={(e) => { setConfirmPasssword(e.target.value) }}
                                required
                                className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>



                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Update Password
                        </button>
                        <p className="mt-4 text-center text-sm text-gray-500">
                            Back to Sign In?{' '}
                            <Link to={"/Login"} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>


            </div>
        </div>


        <Loader loading={loading} />


    </>);
}
