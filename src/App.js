import React, { useEffect } from "react";
import { RoutingCallWeb } from "./components/Main Website/Routing/routingcall";
import { RoutingWebAuth } from "./components/Main Website/AuthRouting/WAroutingcall";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import CryptoJS from 'crypto-js';
import { useSelector, useDispatch } from "react-redux";
import {   allConnections, allFirebaseChats, addNotification, selecteUsers, selecteCurrentUser, login, } from "./components/Store/authSlice";
import { Chats } from "./components/Main Website/Chats/chats";
import 'react-toastify/dist/ReactToastify.css';
import { db } from "./firebase";
import {
  collection,
  getDocs
} from "firebase/firestore";
const secretEnKey = process.env.REACT_APP_SECRET_ENC_KEY



function App() {

  const storeCurrentUser = useSelector(selecteCurrentUser)
  const StoreAllUser = useSelector(selecteUsers)

  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [])

  const decryptUserData = (data) => {
    const decryptedBytes = CryptoJS.AES.decrypt(data, secretEnKey);
    const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;

  }

  useEffect(() => {

    if (!storeCurrentUser) {

      const storedData = localStorage.getItem('REAl_ESTATE_USER_DATA');
      if (storedData) {
        const { user, expiration } = JSON.parse(storedData);
        if (expiration > Date.now()) {
          const userData = decryptUserData(user);
          dispatch(login(userData))
          if (window.location.pathname === "/login") {
            window.location.href = "/page";
          }
        } else {
          localStorage.removeItem('REAl_ESTATE_USER_DATA');
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }
    }
  }, [storeCurrentUser, dispatch])

  useEffect(() => {
    if (StoreAllUser.length > 0 && storeCurrentUser) {

      const thisUser = StoreAllUser.find((user) => user._id === storeCurrentUser._id)
      if (thisUser) {

        dispatch(addNotification(thisUser.Notification))
      }
    }
  }, [StoreAllUser, storeCurrentUser, dispatch]);


  useEffect(() => {
    const fetchchats = async () => {

      const querySnapshot = await getDocs(collection(db, "messages"));
      // const querySnapshot = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "asc"))            );
      const Allchats = []
      querySnapshot.forEach((doc) => {
        if (doc.id.includes(storeCurrentUser._id)) {
          Allchats.unshift({
            chatId: doc.id,
            createdAt: doc.data().createdAt.seconds * 1000 + doc.data().createdAt.nanoseconds / 1e6,
          })
        }
      });
      const sortedChats = Allchats.slice().sort((a, b) => b.createdAt - a.createdAt);

      const chatedUsers = sortedChats.map(chat => {
        const otherUserId = chat.chatId.split('_').find(userid => userid !== storeCurrentUser._id);
        const otherUser = StoreAllUser.find(user => user._id === otherUserId);
        const otherUserData = {
          chatId: chat.chatId,
          otherUser
        }
        return otherUserData;
      }).filter((user) => user.otherUser !== undefined).filter((user) => user.otherUser._id !== storeCurrentUser._id);

      dispatch(allFirebaseChats(chatedUsers))
    };

    if (StoreAllUser.length > 0 && storeCurrentUser ) {
      fetchchats();
    }

  }, [storeCurrentUser, StoreAllUser, dispatch  ]);

  useEffect(() => {
    if (StoreAllUser.length > 0 && storeCurrentUser) {

      const thisUser = StoreAllUser.find((user) => user._id === storeCurrentUser._id)
      if (thisUser) {

        const YourFriends = thisUser.YourConnections.map((reqObj) => {

          const userIndex = StoreAllUser.findIndex((user) => user._id === reqObj.userId);
          if (userIndex !== -1) {
            const User = StoreAllUser[userIndex]
            if (reqObj.isFriend) {
              return User ? User : null;
            }
          }
          return null
        }).filter(users => users !== null);

        dispatch(allConnections(YourFriends));
      }
    }
  }, [StoreAllUser, storeCurrentUser, dispatch]);

  return (<>
    <Router >

      <Routes>
        <Route exact path="/*" element={<RoutingWebAuth />} />
        {storeCurrentUser && <Route exact path="/page/*" element={<RoutingCallWeb />} />}
        {storeCurrentUser && <Route exact path="/Chats/:roomId?" element={<Chats />} />}
        {/* {storeCurrentUser && <Route exact path="/Chats/singleChat/:roomId" element={<SingleChat />} />} */}

        {/* <Route exact path="/Admin/Auth" element={<AuthAdminRouting />} /> */}
        {/* <Route exact path="/Admin/Panel" element={<RoutingAdminPanel />} /> */}
      </Routes>
    </Router>

    <ToastContainer
      position="bottom-left"
      autoClose={3000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored" />
  </>

  );
}

export default App;



// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAuq_LiQ3KnF5hkLR9plxjUxZek1il1Khg",
//   authDomain: "realstate-a7c11.firebaseapp.com",
//   projectId: "realstate-a7c11",
//   storageBucket: "realstate-a7c11.appspot.com",
//   messagingSenderId: "614504433935",
//   appId: "1:614504433935:web:185546fc25f0c51109967a",
//   measurementId: "G-WPN2BFL7J0"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const db = getFirestore(app); // Firestore instance
// // export const db = getFirestore(); // Firestore instance


// {/* <li>
// <a
//     href="/"
//     className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
// >
//     <svg
//         className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 "
//         aria-hidden="true"
//         xmlns="http://www.w3.org/2000/svg"
//         fill="currentColor"
//         viewBox="0 0 18 18"
//     >
//         <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
//     </svg>
//     <span className="flex-1 ml-3 whitespace-nowrap">Kanban</span>
//     <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full ">
//         Pro
//     </span>
// </a>
// </li> */}