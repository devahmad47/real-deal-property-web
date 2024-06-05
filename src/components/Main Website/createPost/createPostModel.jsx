import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { selecteCurrentUser, addPost, addgroupData } from '../../Store/authSlice'
import axios from 'axios'
import { Loader } from '../Loader/loader'
import { toast } from "react-toastify"
import imageCompression from 'browser-image-compression';

const serverURL = process.env.REACT_APP_SERVER_URL

export default function CreatePostModel(props) {
    const { setOpen, calledBy, groupId, open } = props
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false);
    const StoreCurrentUser = useSelector(selecteCurrentUser)
    // const cancelButtonRef = useRef(null)
    const invesmentTypes = [
        { value: "Subto", label: "Subto" },
        { value: "Buy and hold", label: "Buy and hold" },
        { value: "Fix N' Flip", label: "Fix N' Flip" },
        { value: "Wholesale", label: "Wholesale" },
    ]


    const intialpost = {

        postDescription: "",
        CreatorID: StoreCurrentUser._id,
        postDealType: "",
        mediaType: '',
        Postmedia: [],
        Price: "",
        location: '',
        mediaSize: 0,
        postedBy: "",
        userProfileImageSrc: "",
        postCreated: '',

    }
    const [createPostData, setCreatePostData] = useState(intialpost)

    async function handelSubmit(e) {
        e.preventDefault();
        setOpen(false)

        if (loading) {
            return
        }

        try {
            setloading(true)
            createPostData.mediaSize = createPostData.Postmedia.size
            createPostData.postCreated = `${new Date()}`

            if (createPostData.Postmedia.length > 10) {
                toast.info('You can only upload up to 10 files.')
                return;
            }
            const options = {
                maxSizeMB: .5,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };
            const formData = new FormData();

            const allmedia = await Promise.all(createPostData.Postmedia.map(async (file, index) => {
                if (file.type.includes('video')) {
                    formData.append(`Postmedia`, file);
                    return file
                } else {

                    const compressedFile = await imageCompression(file, options);
                    formData.append(`Postmedia`, compressedFile);
                    return compressedFile;
                }
            }));
            // const allmedia = await Promise.all(createPostData.Postmedia.map(async (file, index) => {
            //     // const compressedFile = await imageCompression(file, options);
            //     formData.append(`Postmedia`, file);
            //     return file;
            // }));



            // formData.append('Postmedia', createPostData.Postmedia);
            formData.append('postDescription', createPostData.postDescription);
            formData.append('CreatorID', createPostData.CreatorID);
            formData.append('postDealType', createPostData.postDealType);
            formData.append('Price', createPostData.Price);
            formData.append('location', createPostData.location);
            formData.append('postCreated', `${new Date()}`);
            formData.append('postedBy', StoreCurrentUser.username);
            formData.append('userProfileImageSrc', StoreCurrentUser.profileImageUrl);

            if (calledBy === 'home') {
                const response = await axios.post(`${serverURL}/api/posts/Create_post`, formData, {
                    headers: 'multipart/form-data'
                })
                setloading(false)
                if (response && response.status === 200) {
                    toast.success(response.data.message);
                    dispatch(addPost(response.data.post))

                }
            } else {
                const response = await axios.post(`${serverURL}/api/groups/${groupId}/Create_Discussion_post`, formData)
                setloading(false)
                if (response && response.status === 200) {
                    toast.success(response.data.message);
                    dispatch(addgroupData({ groupId: groupId, group: response.data.group }))
                }
            }


        } catch (error) {
            setloading(false);
            if (error) {
                if (error.response) {

                    toast.error(error.response.data.message);
                }
            } else {
                toast.error("Failed to Create Post");
            }
        }
        // props.setOpen(false)
        setCreatePostData(intialpost)

    }

    const handleFileChange = async (e) => {
        const selectedFiles = e.target.files;

        setCreatePostData((prevData) => ({ ...prevData, Postmedia: Array.from(selectedFiles) }));
    };

    return (<>
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" style={{ zIndex: 14000 }} className="relative " onClose={setOpen}>
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
                                <form onSubmit={handelSubmit}>
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 my-2 sm:pb-4">
                                        <h2 className='text-center font-bold text-blue-400'>Create Post</h2>
                                        <div className="grid grid-cols-2  gap-2 my-2">

                                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                                    <h2 className="italic">Price</h2>
                                                </div>
                                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                                    <input
                                                        required
                                                        value={createPostData.Price}
                                                        onChange={(e) => {
                                                            setCreatePostData((pre) => ({ ...pre, Price: e.target.value }))
                                                        }}
                                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Price" />
                                                    <span>
                                                        $
                                                    </span>
                                                </div>
                                            </div>

                                            <div className=" p-2 col-span-2 md:col-span-1">
                                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                                    <h2 className="italic">Location</h2>
                                                </div>
                                                <div>
                                                    <input
                                                        required
                                                        value={createPostData.location}
                                                        onChange={(e) => {
                                                            setCreatePostData((pre) => ({ ...pre, location: e.target.value }))
                                                        }}
                                                        type="text" className=" text-sm focus:outline-none focus:ring-2 ring-blue-500 w-full p-1 px-2 border rounded  focus:shadow-none " placeholder="D Block, Lahore, punjab, pakistan" />
                                                </div>
                                            </div>

                                            <div className="col-span-2 md:col-span-1">
                                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                                    <h2 className="italic">Deal Type</h2>
                                                </div>
                                                <Select
                                                    required
                                                    onChange={(e) => {
                                                        setCreatePostData((pre) => ({ ...pre, postDealType: e.value }))
                                                    }}

                                                    className={` w-full `} options={invesmentTypes}
                                                />
                                            </div>

                                            <div className=" p-1 col-span-2 md:col-span-1">
                                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                                    <h2 className="italic">Choose Post Media</h2>
                                                </div>
                                                <div >
                                                    <input
                                                        required
                                                        onChange={handleFileChange}
                                                        // onChange={(e) => {
                                                        //     const selectedFiles = e.target.files;

                                                        //     if (selectedFiles.length > 10) {
                                                        //         // Alert or inform the user that they can only upload up to 10 files
                                                        //         console.error('You can only upload up to 10 files.');
                                                        //         return;
                                                        //     }

                                                        //     setCreatePostData((pre) => ({ ...pre, Postmedia: selectedFiles[0] }));
                                                        // }}
                                                        // onChange={(e) => {
                                                        //     setCreatePostData((pre) => ({ ...pre, Postmedia: e.target.files[0] }))

                                                        // }}
                                                        type="file" multiple accept="image/*, video/*" className=" bg-white  w-full p-1 px-2 rounded  italic border  hover:border-blue-500  hover:shadow-none " />
                                                </div>
                                            </div>
                                            <div className=" p-1 col-span-2 ">
                                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                                    <h2 className="italic">Description</h2>
                                                </div>
                                                <div>
                                                    <textarea rows={3}
                                                        required
                                                        value={createPostData.postDescription}
                                                        onChange={(e) => {
                                                            setCreatePostData((pre) => ({ ...pre, postDescription: e.target.value }))
                                                        }}
                                                        type="text" className="  focus:outline-none focus:ring-2 ring-blue-500 w-full p-1 px-2 border rounded  focus:shadow-none " placeholder="Enter deal description..." />
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="submit"
                                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                        >
                                            Add Post
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setOpen(false)}
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
