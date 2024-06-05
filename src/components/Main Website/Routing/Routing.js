import { Navigate } from "react-router-dom";
import { E404 } from "../404/404";
import { Home } from "../Home/home";
import { MyConnections } from "../connections/connections";
// import { Groups } from "../Groups/groups";
import { Saved } from "../Saved/saved";
import { Request } from "../connections/request";
// import { GroupPage } from "../Groups/groupPage";
// import { Discussion } from "../Groups/Subpages/Discussion";
// import { MembersPage } from "../Groups/Subpages/Members";
// import { MediaPage } from "../Groups/Subpages/mediaPage";
import { FulllayoutMainWeb } from "./Layout"
// import { Videos } from "../Groups/Subpages/nestedSubPages/videos";
// import { Photos } from "../Groups/Subpages/nestedSubPages/photos";
import { Profile } from "../profile/profile";
import { PrivateRoute } from "./privateRouting";
import { Sharedpost } from "../sharedPost/sharedPostPage";
import { Oprofile } from "../OtherUserProfile.jsx/Oprofile";
import { CreatePost } from "../createPost/CreatePost";
export const ThemeRoutePage = [

  {
    path: "/",
    element: <FulllayoutMainWeb />,
    children: [
      { path: "/", exact: true, element: <Navigate to="Home" /> },
      { path: "Home", exact: true, element: <PrivateRoute element={<Home />} /> },
      { path: "Request", exact: true, element: <PrivateRoute element={<Request />} /> },
      { path: "Connections", exact: true, element: <PrivateRoute element={<MyConnections />} /> },
      { path: "Profile", exact: true, element: <PrivateRoute element={<Profile />} /> },
      { path: "users/:userId", exact: true, element: <PrivateRoute element={<Oprofile />} /> },
      // { path: "Groups", exact: true, element: <PrivateRoute element={<Groups />} /> },
      { path: "posts/:postID", exact: true, element: <PrivateRoute element={<Sharedpost />} /> },
      { path: "create_post/:origin/:groupId?", exact: true, element: <PrivateRoute element={<CreatePost />} /> },
      // {
      //   path: "Groups/:groupId", exact: true, element: <PrivateRoute element={<GroupPage />} />,
      //   children: [
      //     { path: "Discussion", exact: true, element: <PrivateRoute element={<Discussion />} /> },
      //     // { path: "Members", exact: true, element: <PrivateRoute element={<MembersPage />} /> },
      //     {
      //       path: "Media", exact: true, element: <PrivateRoute element={<MediaPage />} />,
      //       children: [
      //         { path: "Videos", exact: true, element: <PrivateRoute element={<Videos />} /> },
      //         { path: "Photos", exact: true, element: <PrivateRoute element={<Photos />} /> },

      //       ],

      //     },
      //   ],
      // },
      { path: "Saved", exact: true, element: <Saved /> },
      { path: "*", exact: true, element: <E404 /> },


    ],
  },
];

