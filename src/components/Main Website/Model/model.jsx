
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import {
    collection,
    doc,
    deleteDoc,
    getDocs
} from "firebase/firestore";
import { useSelector, useDispatch } from 'react-redux';
import { db } from '../../../firebase';
import { selecteCurrentUser, selecteUsers, allFirebaseChats } from '../../Store/authSlice';
export function Modal(props) {
    const dispatch = useDispatch()
    const storeCurrentUser = useSelector(selecteCurrentUser)
    const StoreAllUser = useSelector(selecteUsers)

    const { isOpen, setIsOpen, name, setloading, roomID } = props
    async function deleteChat() {
        setIsOpen(false)
        setloading(true)

        if (!roomID) {
            console.error('RoomID is not defined.');
            return;
        }
        const mainDocRef = doc(db, 'messages', roomID);

        try {
            await deleteDoc(mainDocRef);
            console.log('Main document deleted successfully.');

            const chatCollectionRef = collection(db, 'messages', roomID, 'chat');
            const chatDocs = await getDocs(chatCollectionRef);

            chatDocs.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            console.log('Chat and its subcollection deleted successfully.');
            if (StoreAllUser.length > 0 && storeCurrentUser) {
                fetchchats();
            }
            setloading(false)
        } catch (error) {
            setloading(false)
            console.error('Error deleting chat:', error);
        }
    }
    async function closeModal() {
        setIsOpen(false)
    }


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

    return (
        <>


            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-red-600 p-3 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-cyan-900"
                                    >
                                        Delete {name} chat
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-white">
                                            Are you sure you want to proceed with the deletion? This action cannot be undone.

                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={deleteChat}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
