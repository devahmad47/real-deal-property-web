import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  selectedChat: null,
  ChatUser: null,
  notification: [],
  firebaseChats: [],
  Chats: [],
  Allusers: [],
  currentUser: null,
  verifyUser: {
    email: '',
    verificationCode: "",
  },
  GroupsList: [],

  Allposts: [],
  myShortcuts: [],
  yourNotification: [],
  Ads: [],
  connections: []

};

// MessageHeading: 'Successfully saved!',
// MessageContent: 'Anyone with a link can now view this file',
// messageTime: `${new Date()}`,
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
    updateUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
    allusers: (state, action) => {
      state.Allusers = action.payload;
    },
    addToAlusers: (state, action) => {
      const { Updateduser } = action.payload;
      const newState = JSON.parse(JSON.stringify(state));
      const userIndex = newState.Allusers.findIndex((user) => user._id === Updateduser._id);
      if (userIndex !== -1) {
        newState.Allusers[userIndex] = Updateduser
      }
      return newState;
    },

    addAllposts: (state, action) => {
      state.Allposts = action.payload
    },
    addPost: (state, action) => {
      state.Allposts = [action.payload, ...state.Allposts]
    },
    removePost: (state, action) => {
      const { _id } = action.payload;
      const newState = JSON.parse(JSON.stringify(state));
      const PostIndex = newState.Allposts.findIndex((post) => post._id === _id);
      if (PostIndex !== -1) {
        newState.Allposts = newState.Allposts.filter(obj => obj._id !== _id)
      }
      return newState;
    },
    addToSavePost: (state, action) => {
      const { postId, isDiscussionPost, groupId } = action.payload;

      const newState = JSON.parse(JSON.stringify(state));

      if (isDiscussionPost) {
        // const groupIndex = newState.GroupsList.findIndex((group) => group._id === groupId);
        // if (groupIndex !== -1) {
        //   const Dispost = newState.GroupsList[groupIndex].groupDicussionsPost.find(post => post._id === postId);

        //   if (Dispost) {
        //   }
        // }
        newState.currentUser.Savedposts = [...newState.currentUser.Savedposts, { postId, isDiscussionPost, groupId }];
      } else {
        newState.currentUser.Savedposts = [...newState.currentUser.Savedposts, { postId, isDiscussionPost }];
        // const Post = newState.Allposts.find((post) => post._id === postId);
        // if (Post) {
        // }
      }
      return newState;
    },
    removefromSavePost: (state, action) => {
      const { postId } = action.payload
      state.currentUser.Savedposts = state.currentUser.Savedposts.filter(pst => pst.postId !== postId)
    },
    addPostComment: (state, action) => {

      const { _id, comment } = action.payload;

      const newState = JSON.parse(JSON.stringify(state));

      const postIndex = newState.Allposts.findIndex((post) => post._id === _id);
      if (postIndex !== -1) {
        newState.Allposts[postIndex].current = true
        newState.Allposts[postIndex].comments.unshift(comment);

      }
      return newState;

    },

    addGroup: (state, action) => {
      state.GroupsList = [...state.GroupsList, action.payload]
    },
    addAllGroup: (state, action) => {
      state.GroupsList = action.payload
    },

    updateGroup: (state, action) => {
      const { groupId, Pined } = action.payload;
      const newState = JSON.parse(JSON.stringify(state));
      const groupIndex = newState.GroupsList.findIndex((group) => group._id === groupId);
      if (groupIndex !== -1) {
        newState.GroupsList[groupIndex].Pined = Pined
      }
      return newState;
    },

    addgroupData: (state, action) => {

      const { groupId, group } = action.payload;
      const newState = JSON.parse(JSON.stringify(state));

      const groupIndex = newState.GroupsList.findIndex((group) => group._id === groupId);
      if (groupIndex !== -1) {
        newState.GroupsList[groupIndex] = group
      }
      return newState;

    },
    removeDiscussionPost: (state, action) => {
      const { groupId, discussionPostID } = action.payload;
      const newState = JSON.parse(JSON.stringify(state));

      const groupIndex = newState.GroupsList.findIndex((group) => group._id === groupId);
      if (groupIndex !== -1) {
        newState.GroupsList[groupIndex].groupDicussionsPost = newState.GroupsList[groupIndex].groupDicussionsPost.filter(post => post._id !== discussionPostID)

      }
      return newState;
    },
    addDiscussionPostComment: (state, action) => {
      const { groupId, postId, comment } = action.payload;
      const newState = JSON.parse(JSON.stringify(state));

      const groupIndex = newState.GroupsList.findIndex((group) => group._id === groupId);

      if (groupIndex !== -1) {
        const post = newState.GroupsList[groupIndex].groupDicussionsPost.find(post => post._id === postId)
        post.comments.unshift(comment)
      }
      return newState;
    },

    postReactiondiscussionPost: (state, action) => {
      const { groupId, postId, reaction, userReaction } = action.payload;

      const newState = JSON.parse(JSON.stringify(state));

      const groupIndex = newState.GroupsList.findIndex((group) => group._id === groupId);

      if (groupIndex !== -1) {
        const group = newState.GroupsList[groupIndex];
        const postIndex = group.groupDicussionsPost.findIndex(post => post._id === postId);

        if (postIndex !== -1) {
          const post = group.groupDicussionsPost[postIndex];

          if (reaction) {
            post.postReactions.push(userReaction);
          } else {
            post.postReactions = post.postReactions.filter(rec => rec.ReactorId !== userReaction.ReactorId);
          }
          // group.groupDicussionsPost[postIndex] = post;
        }
        // state.GroupsList[groupIndex] = group;
      }
      return newState;

    }
    ,
    addMediatoGroup: (state, action) => {

      const { groupId, addGroupMedia } = action.payload;
      const newState = JSON.parse(JSON.stringify(state));

      const groupIndex = newState.GroupsList.findIndex((group) => group.groupID === groupId);
      if (groupIndex !== -1) {
        newState.GroupsList[groupIndex].Media.push(addGroupMedia)

      }
      return newState;
    },

    addComment: (state, action) => {

      const { groupId, _id, comment } = action.payload;
      const newState = JSON.parse(JSON.stringify(state));

      const groupIndex = newState.GroupsList.findIndex((group) => group._id === groupId);
      if (groupIndex !== -1) {
        const postIndex = newState.GroupsList[groupIndex].groupDicussionsPost.findIndex((post) => post._id === _id);
        if (postIndex !== -1) {
          newState.GroupsList[groupIndex].groupDicussionsPost[postIndex].current = true
          newState.GroupsList[groupIndex].groupDicussionsPost[postIndex].comments.unshift(comment);
        }
      }

      return newState;

    },


    removeGroup: (state, action) => {
      const { _id } = action.payload;
      const newState = JSON.parse(JSON.stringify(state));
      const groupIndex = newState.GroupsList.findIndex((group) => group._id === _id);
      if (groupIndex !== -1) {
        newState.GroupsList = newState.GroupsList.filter(obj => obj._id !== _id)
        const shortcutIndex = newState.currentUser.shortcuts.findIndex((group) => group.groupID === _id);

        if (shortcutIndex !== -1) {
          // Create a new array without the removed shortcut
          newState.currentUser.shortcuts = [
            ...newState.currentUser.shortcuts.slice(0, shortcutIndex),
            ...newState.currentUser.shortcuts.slice(shortcutIndex + 1),
          ];
        }
        // newState.currentUser.shortcuts.splice(shortcutIndex, 1)
      }
      return newState;
    },



    postReactionF: (state, action) => {
      const { postId, reaction, userReaction, } = action.payload;
      const newState = JSON.parse(JSON.stringify(state));

      const postN = newState.Allposts.find((post) => post._id === postId);

      if (postN) {
        // newState.Allposts[Index] = post

        if (reaction) {
          postN.postReactions.push(userReaction);
        } else {
          if (postN.postReactions && postN.postReactions.length > 0) {
            postN.postReactions = postN.postReactions.filter(rec => rec.ReactorId !== userReaction.ReactorId);
          }
        }
      }
      return newState;
    },
    addnewNotification: (state, action) => {
      state.yourNotification = [action.payload, ...state.yourNotification,]
    },
    addNotification: (state, action) => {
      state.yourNotification = action.payload
    },

    removeNotification: (state, action) => {
      const { _id } = action.payload
      state.yourNotification = state.yourNotification.filter(pst => pst._id !== _id)
    },
    addToVerifyUser: (state, action) => {
      state.verifyUser = action.payload

    },

    addSelectedChat: (state, action) => {
      state.selectedChat = action.payload
    },
    addChatUser: (state, action) => {
      state.ChatUser = action.payload
    },
    addChatNotification: (state, action) => {
      state.notification = [...state.notification, action.payload]
    },
    addChats: (state, action) => {
      state.Chats = [...state.Chats, action.payload]
    },
    allAdsStore: (state, action) => {
      state.Ads = action.payload;
    },
    allFirebaseChats: (state, action) => {
      state.firebaseChats = action.payload;
    },
    allConnections: (state, action) => {
      state.connections = action.payload;
    },
    // addAd: (state, action) => {
    //   state.Ads = [...state.Ads, action.payload];
    // },

  },

});


export const selecteUsers = (state) => state.auth.Allusers;
export const selecteCurrentUser = (state) => state.auth.currentUser;
export const selecteGroupList = (state) => state.auth.GroupsList;
export const selecteAllPost = (state) => state.auth.Allposts;
export const selecteNotification = (state) => state.auth.yourNotification;
export const selecteVerifyUser = (state) => state.auth.verifyUser;

export const selectSelectedChat = (state) => state.auth.selectedChat;
export const selectChatUser = (state) => state.auth.ChatUser;
export const selectChatNotification = (state) => state.auth.notification;
export const selectChats = (state) => state.auth.Chats;
export const selectAllAds = (state) => state.auth.Ads;
export const selectfirebaseChat = (state) => state.auth.firebaseChats;
export const selectConnections = (state) => state.auth.connections;


export const { allConnections, allFirebaseChats, removeNotification, addnewNotification, addAd, allAdsStore, login, logout, allusers, addGroup, addComment, addPost, addPostComment, addgroupDicussionsPost, addMediatoGroup, addNotification, addToVerifyUser, addAllposts, removePost, postReactionF, addAllGroup, removeGroup, updateUser, updateGroup, removeDiscussionPost, addDiscussionPostComment, addgroupData, postReactiondiscussionPost, addToSavePost, removefromSavePost, addToAlusers, addChatNotification, addChatUser, addSelectedChat, addChats } = authSlice.actions;

export default authSlice.reducer;


// postReactiondiscussionPost: (state, action) => {
//   const { groupId, postId, reaction, userReaction } = action.payload;
//   const newState = JSON.parse(JSON.stringify(state));

//   const groupIndex = newState.GroupsList.findIndex((group) => group._id === groupId);

//   if (groupIndex !== -1) {
//     const post = newState.GroupsList[groupIndex].groupDicussionsPost.find(post => post._id === postId)
//     if (reaction) {
//       post.postReactions.push(userReaction)
//     } else {
//       post.postReactions = post.postReactions.filter(rec => rec.ReactorId !== userReaction.ReactorId)

//     }

//   }
//   return newState;
// },

// addtoMyShortcuts: (state, action) => {

//   const { _id, groupName, groupDescription, groupThumbnilURL } = action.payload;
//   const newState = JSON.parse(JSON.stringify(state));

//   const groupIndex = newState.GroupsList.findIndex((group) => group._id === _id);
//   if (groupIndex !== -1) {
//     newState.GroupsList[groupIndex].Pined = true
//   }
//   newState.myShortcuts.push({
//     groupID: _id, groupName, groupDescription, groupThumbnilURL,
//   })

//   return newState;
// },
// removefromShortcuts: (state, action) => {
//   const { groupID, } = action.payload;
//   const newState = JSON.parse(JSON.stringify(state));

//   const groupIndex = newState.GroupsList.findIndex((group) => group.groupID === groupID);
//   if (groupIndex !== -1) {
//     newState.GroupsList[groupIndex].Pined = false
//     newState.myShortcuts = newState.myShortcuts.filter(obj => obj.groupID !== groupID)
//   }
//   return newState;
// },

// {
//   Pined: false,
//   current: false,
//   _id: "56sjdjshjd878f",
//   groupName: "Valley Of Dubai",
//   groupDescription: "Most popular Villas of Dubai",
//   groupThumbnilURL: "/b1.jpg",
//   createdBy: "Umair Athar",
//   CreatorID: "6544a23acaecc68a1d37929e",
//   createdDate: "10-03-2002",

//   Members: [
//     {
//       UserName: "Absena Store",
//       ProfileImage: "b.jpg",
//       description: "Valley of Dreams"

//     },
//     {
//       UserName: "Property Prodigy Plaza",
//       ProfileImage: "b1.jpg",
//       description: "Unlock Your Dream Home in Property Prodigy Plaza"

//     },
//     {
//       UserName: "Eco-Haven Estates",
//       ProfileImage: "b2.jpeg",
//       description: "Find Your Green Retreat at Eco-Haven Estates"

//     },
//     {
//       UserName: "Golden Gate Residences",
//       ProfileImage: "b4.jpeg",
//       description: "Discover Luxury Living at Golden Gate Residences"

//     },
//     {
//       UserName: "Harborview Haven",
//       ProfileImage: "b7.jpg",
//       description: "Experience Coastal Living at Harborview Haven"

//     },
//     {
//       UserName: "Heritage Heights Homes",
//       ProfileImage: "b8.jpg",
//       description: "Preserve Your Legacy at Heritage Heights Homes"

//     },
//   ],
//   groupDicussionsPost: [
//     {

//       current: false,
//       _id: "123rt45321",
//       userProfileImageSrc: 'person.jpg',
//       postedBy: 'Umair Athar',
//       CreatorID: "876543275432mkjkf     ",
//       postCreated: 'Wed Nov 01 2023 14:06:51 GMT+0500 (Pakistan Standard Time)',
//       title: "Preserve Your Legacy at Heritage Heights Homes",
//       postDescription: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo assumenda quibusdam sit, ipsam quae eaque consequuntur accusantium recusandae eveniet quisquam distinctio laborum omnis, esse impedit iusto natus laboriosam, magnam atque.",
//       mediaType: 'media/mp4',
//       mediaUrl: '/a.mp4',
//       postReactions: "100",

//       postSahre: "4",
//       postDealType: "Fix N' Flip",
//       Price: "1200",
//       comments: [{
//         commentPostedBy: "Umair Athar",
//         commentCreated: "12-03-2024",
//         UserComment: "hi it is testing",
//         _id: "123rt45321",
//       },],

//     },
//     {
//       current: false,
//       _id: "djfhmsnkamln3984",
//       userProfileImageSrc: 'person.jpg',
//       postedBy: 'Qasim Athar',
//       CreatorID: "28902454",
//       postCreated: 'Wed Nov 01 2023 14:06:51 GMT+0500 (Pakistan Standard Time)',
//       title: " Experience Coastal Living at Harborview Haven",
//       postDescription: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo assumenda quibusdam sit, ipsam quae eaque consequuntur accusantium recusandae eveniet quisquam distinctio laborum omnis, esse impedit iusto natus laboriosam, magnam atque.",
//       mediaType: 'image/jpg',
//       mediaUrl: '/b7.jpg',
//       postReactions: "4.3k",
//       postSahre: "34",
//       postDealType: "Subto",
//       Price: "300",
//       comments: [],

//     },
//     // {
//     //     userProfileImageSrc: 'person.jpg',
//     //     postedBy: 'Qasim Athar',
//     // postCreated: 'Wed Nov 01 2023 14:06:51 GMT+0500 (Pakistan Standard Time)',
//     //     postDescription: " Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo assumenda quibusdam sit, ipsam quae eaque consequuntur accusantium recusandae eveniet quisquam distinctio laborum omnis, esse impedit iusto natus laboriosam, magnam atque.",
//     //     mediaType: 'media/mp4',
//     //     mediaUrl: 'b.mp4',
//     //     postReactions: "100",
//     //
//     //     postSahre: "4",
//     //     postDealType: "Buy and Hold",
//     //     Price: "1200"
//     // },

//     {
//       current: false,
//       _id: "478392oqwiasjknmxh",
//       userProfileImageSrc: 'person.jpg',
//       postedBy: 'Ali',
//       CreatorID: "28902454",
//       postCreated: 'Wed Nov 01 2023 14:06:51 GMT+0500 (Pakistan Standard Time)',
//       title: " Discover Luxury Living at Golden Gate Residences",
//       postDescription: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo assumenda quibusdam sit, ipsam quae eaque consequuntur accusantium recusandae eveniet quisquam distinctio laborum omnis, esse impedit iusto natus laboriosam, magnam atque.",
//       mediaType: 'image/jpg',
//       mediaUrl: '/b.jpg',
//       postReactions: "783k",
//       postSahre: "300",
//       postDealType: "WholeSale",
//       Price: "800",
//       comments: [],

//     },
//     {
//       current: false,

//       _id: "478392oqwiasjknmxh",
//       userProfileImageSrc: 'person.jpg',
//       postedBy: 'Faizan',
//       CreatorID: "28902454",
//       postCreated: 'Wed Nov 01 2023 14:06:51 GMT+0500 (Pakistan Standard Time)',
//       title: " Discover Luxury Living at Golden Gate Residences",
//       postDescription: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo assumenda quibusdam sit, ipsam quae eaque consequuntur accusantium recusandae eveniet quisquam distinctio laborum omnis, esse impedit iusto natus laboriosam, magnam atque.",
//       mediaType: 'image/jpg',
//       mediaUrl: '/b6.jpg',
//       postReactions: "5k",
//       postSahre: "700",
//       postDealType: "Fix N' Flip",
//       Price: "700",
//       comments: [],


//     },
//   ],
//   Media: [

//     {
//       mediaID: '',
//       mediaType: 'video/mp4',
//       mediaTitle: "house",
//       mediaAddedDate: "23-05-2023",
//       mediaPostedBy: 'ali ahmed',
//       mediaUrl: 'media.mp4',
//       mediaSize: 0,

//     },
//     {
//       mediaID: '',
//       mediaType: 'video/mp4',
//       mediaTitle: "Villa",
//       mediaAddedDate: "13-03-2023",
//       mediaPostedBy: 'Qasim',
//       mediaUrl: 'a.mp4',
//       mediaSize: 0,

//     },
//     {
//       mediaID: '',
//       mediaType: 'video/mp4',
//       mediaTitle: "Bangla",
//       mediaAddedDate: "23-05-2023",
//       mediaPostedBy: 'ali ahmed',
//       mediaUrl: 'b.mp4',
//       mediaSize: 0,

//     },

//     {
//       mediaID: '',
//       mediaTitle: "Bangla",
//       mediaType: 'image/jpeg',
//       mediaAddedDate: "23-05-2023",
//       mediaPostedBy: 'ali ahmed',
//       mediaUrl: 'b2.jpeg',
//       mediaSize: 0,
//     },
//     {
//       mediaID: '',
//       mediaTitle: "Bangla",
//       mediaType: 'image/jpg',
//       mediaAddedDate: "23-05-2023",
//       mediaPostedBy: 'ali ahmed',
//       mediaUrl: 'b6.jpg',
//       mediaSize: 0,

//     },
//     {
//       mediaID: '',
//       mediaTitle: "Bangla",
//       mediaAddedDate: "23-05-2023",
//       mediaType: 'image/jpg',
//       mediaPostedBy: 'ali ahmed',
//       mediaUrl: 'b7.jpg',
//       mediaSize: 0,

//     },
//     {
//       mediaID: '',
//       mediaTitle: "Bangla",
//       mediaAddedDate: "23-05-2023",
//       mediaType: 'image/jpg',
//       mediaPostedBy: 'ali ahmed',
//       mediaUrl: 'b8.jpg',
//       mediaSize: 0,

//     },
//   ]

// },
