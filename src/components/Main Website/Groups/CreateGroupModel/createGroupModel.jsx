import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useDispatch, useSelector } from 'react-redux'
import { addGroup, selecteCurrentUser } from '../../../Store/authSlice'
import { Loader } from '../../Loader/loader'
import { toast } from 'react-toastify'
import axios from 'axios'
const serverURL = process.env.REACT_APP_SERVER_URL


export default function CreateGroup(props) {
    const dispatch = useDispatch()
    const storeCurrentUser = useSelector(selecteCurrentUser)
    const [loading, setloading] = useState(false)

    const newgroup = {
        groupName: "",
        groupDescription: "",
        groupThumbnilMedia: "",
        createdBy: "",
        CreatorID: "",
    }


    const [createGroupData, setcreateGroupData] = useState(newgroup)

    return (<>
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog as="div" style={{ zIndex: 14000 }} className="relative " onClose={props.setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        props.setOpen(false)
                                        setloading(true)
                                        const formData = new FormData();
                                        formData.append('groupName', createGroupData.groupName);
                                        formData.append('groupDescription', createGroupData.groupDescription);
                                        formData.append('CreatorID', storeCurrentUser._id);
                                        formData.append('createdBy', storeCurrentUser.username);
                                        formData.append('createdDate', `${new Date()}`);
                                        formData.append('groupThumbnilMedia', createGroupData.groupThumbnilMedia);
                                        const response = await axios.post(`${serverURL}/api/groups/Create_group`, formData)
                                        setloading(false)
                                        if (response && response.status === 200) {
                                          
                                            toast.success(response.data.message);
                                            dispatch(addGroup(response.data.Newgroup))

                                        }
                                    } catch (error) {
                                        setloading(false);
                                        if (error) {
                                            if (error.response) {
                                                toast.error(error.response.data.message);
                                               
                                            } else {
                                                toast.error("Failed to Create Group");
                                            }
                                        }
                                    }

                                    setcreateGroupData(newgroup)

                                }}>
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 my-2 sm:pb-4">
                                        <h2 className='text-center font-bold text-blue-400'>Create Post</h2>
                                        <div className="grid grid-cols-2  gap-2 my-2">

                                            <div className=" p-2  col-span-2 md:col-span-1">
                                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                                    <h2 className="italic">Name</h2>
                                                </div>
                                                <div>
                                                    <input
                                                        required
                                                        value={createGroupData.groupName}
                                                        onChange={(e) => {
                                                            setcreateGroupData((pre) => ({ ...pre, groupName: e.target.value }))
                                                        }}
                                                        type="text" className=" text-sm focus:outline-none focus:ring-2 ring-blue-500 w-full py-2 px-2 border rounded  focus:shadow-none " placeholder="Valley of Dubai" />
                                                </div>
                                            </div>


                                            <div className=" p-1 col-span-2 md:col-span-1">
                                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                                    <h2 className="italic">Choose Group Thumbnil</h2>
                                                </div>
                                                <div >
                                                    <input
                                                        required
                                                        onChange={(e) => {
                                                            setcreateGroupData((pre) => ({ ...pre, groupThumbnilMedia: e.target.files[0] }))

                                                        }}
                                                        type="file" accept="image/*" className=" bg-white  w-full p-1 px-2 rounded  italic border  hover:border-blue-500  hover:shadow-none " />
                                                </div>
                                            </div>

                                            <div className=" p-1 col-span-2 ">
                                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                                    <h2 className="italic">Description</h2>
                                                </div>
                                                <div>
                                                    <textarea rows={3}
                                                        required
                                                        value={createGroupData.groupDescription}
                                                        onChange={(e) => {
                                                            setcreateGroupData((pre) => ({ ...pre, groupDescription: e.target.value }))
                                                        }}
                                                        type="text" className="  focus:outline-none focus:ring-2 ring-blue-500 w-full p-1 px-2 border rounded  focus:shadow-none " placeholder="Enter  description..." />
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="submit"
                                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                        >
                                            Create Group
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => props.setOpen(false)}
                                        // ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
        <Loader loading={loading} />
    </>)
}
