import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Loader } from '../Loader/loader'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { removePost, removeGroup, removeDiscussionPost , removefromSavePost } from '../../Store/authSlice'

const serverURL = process.env.REACT_APP_SERVER_URL



export default function DeleteModel(props) {
  const [loading, setloading] = useState(false)
  const cancelButtonRef = useRef(null)
  const dispatch = useDispatch()
  // const dispatch = useSelector()
  const deletePost = async (e) => {
    e.preventDefault()
    props.setDeleteA(false)
    if (props.deleteWhat === "group") {
      try {
        setloading(true)
        const response = await axios.delete(`${serverURL}/api/groups/${props.deletedId}/delete_Group`)
        setloading(false)
        if (response && response.status === 200) {
          toast.success(response.data.message);
          dispatch(removeGroup({ _id: response.data.DeletedGroup._id }))
        }
      } catch (error) {
        setloading(false)
        if (error) {
          if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Failed to Delete Group");
          }
        }
      }
    } else if (props.deleteWhat === "HomePost") {
      try {
        setloading(true)
        const response = await axios.delete(`${serverURL}/api/posts/${props.deletedId}/delete_post`)
        setloading(false)
        if (response && response.status === 200) {
          toast.success(response.data.message);

          dispatch(removePost({ _id: response.data.DeletedPost._id }))
          dispatch(removefromSavePost({ postId: props.deletedId }))
        }
      } catch (error) {
        setloading(false)
        if (error) {
          if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Failed to Delete Post");
          }
        }
      }
    }
    else if (props.deleteWhat === "Discussionpost") {
      try {
        setloading(true)
        const response = await axios.delete(`${serverURL}/api/groupsPost/${props.groupId}/delete_discussion_post/${props.deletedId}`)
        setloading(false)
        if (response && response.status === 200) {
          toast.success(response.data.message);
          dispatch(removeDiscussionPost({ groupId: props.groupId, discussionPostID: response.data.deletedPost._id }))
        }
      } catch (error) {
        setloading(false)
        if (error) {
          if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Failed to Delete Post");
          }
        }
      }
    }



  }

  return (<>

    <Transition.Root show={props.deleteA} as={Fragment}>
      <Dialog as="div" style={{ zIndex: 14000 }} className="relative " initialFocus={cancelButtonRef} onClose={props.setDeleteA}>
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

                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        {props.heading}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {props.bodyContent}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={deletePost} className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    {props.buttonContent}
                  </button>
                  <button
                    type="button"

                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => props.setDeleteA(false)}

                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
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
