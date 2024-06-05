import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
// import { useDispatch } from 'react-redux';
// import { login } from '../../Store/authSlice';
import { Loader } from "../Loader/loader";
// import CryptoJS from 'crypto-js';
const serverURL = process.env.REACT_APP_SERVER_URL
// const secretEnKey = process.env.REACT_APP_SECRET_ENC_KEY


export function ForgetPassword() {
  const navigate = useNavigate();
  const location = useLocation()
  // const dispatch = useDispatch()
  const [loading, setloading] = useState(false);
  const [VerifyFields, setVerifyField] = useState(false);
  const [forgetData, setforgetData] = useState({
    email: '',
  });

  useEffect(() => {
    const name = location.pathname.slice(1).split('/')
    document.title = name[name.length - 1]

  }, [location])


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setforgetData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };


  async function handelSubmit(e) {
    e.preventDefault();

    try {

      setloading(true)
      const response = await axios.post(`${serverURL}/api/auth/verify_email`, { email: forgetData.email });


      if (response) {
        if (response.status === 200) {
          setloading(false)
          toast.success(response.data.message)
        }
      }

    } catch (error) {
      setloading(false);
      if (error) {
        if (error.response) {
         
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to Reset Password, try Again Later");
        }
      }
    }



  }

  useEffect(() => {
    const name = location.pathname.slice(1).split('/')
    document.title = name[name.length - 1]

  }, [location])
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const verification = searchParams.get('verification');

    if (verification === 'error') {
      toast.error('Email verification Failed');
      // const storedData = localStorage.getItem('REAl_ESTATE_USER_DATA');
      // if (storedData) {
      //     navigate("/page/Profile?verification=error")
      // }

    }
  }, [location.search , navigate]);

  

  return (<>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Link to={"/Login"} className="sm:mx-auto my-4 sm:w-full sm:max-w-sm">
        <img
          className="mx-auto  h-16  w-auto"
          src="/Real Deal Exchange_Name_White.png"
          alt="Your Company"
        />

      </Link>
      <div style={{ boxShadow: ` 5px 5px 10px rgba(0, 0, 0, 0.2)` }} className="mt-2 sm:mx-auto border  p-4 rounded-lg sm:w-full sm:max-w-sm">
        {VerifyFields && <div onClick={() => { setVerifyField(false) }} className="flex items-center justify-start cursor-pointer mb-4 ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>

        </div>}
        <form onSubmit={handelSubmit} className="space-y-6" >
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={VerifyFields}
                value={forgetData.email}
                onChange={handleInputChange}
                placeholder="Enter your Email Address"
                className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>


          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Verify
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
