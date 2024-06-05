import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { login, logout } from '../../Store/authSlice';
import CryptoJS from 'crypto-js';
const secretEnKey = process.env.REACT_APP_SECRET_ENC_KEY


export const PrivateRoute = ({ element }) => {
    const [session, setSession] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const decryptUserData = (data) => {
        const decryptedBytes = CryptoJS.AES.decrypt(data, secretEnKey);
        const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;

    }

    useEffect(() => {
        async function checkuser() {
            try {

                const storedData = localStorage.getItem('REAl_ESTATE_USER_DATA');
                if (storedData) {
                    const { user, expiration } = JSON.parse(storedData);
                    if (expiration > Date.now()) {
                        const userData = decryptUserData(user);
                        dispatch(login(userData))
                        setSession(true)

                    } else {
                        localStorage.removeItem('REAl_ESTATE_USER_DATA');
                        setSession(false)
                        dispatch(logout())
                        navigate('/Login')
                    }
                }

            } catch (error) {
                toast.error('Unable to Load User, try Again Later');
                setSession(false)
                navigate('/Login');
            }
        }
        checkuser()


    }, [dispatch, navigate]);


    return session ? element : null;
};

