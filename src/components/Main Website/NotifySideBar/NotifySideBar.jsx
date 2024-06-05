import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { selecteNotification, removeNotification, selecteCurrentUser } from '../../Store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../Loader/loader';
import axios from 'axios';
const serverURL = process.env.REACT_APP_SERVER_URL


export default function NotifySideBar(props) {
  const dispatch = useDispatch()
  const storeNotification = useSelector(selecteNotification);
  const storeCurrentUser = useSelector(selecteCurrentUser);
  const [loading, setloading] = useState(false)
  return (<>

    <Transition.Root show={props.openNotify} as={Fragment}>
      <Dialog as="div" style={{ zIndex: 15000 }} className="relative" onClose={props.setOpenNotify}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => props.setOpenNotify(false)}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-base font-bold text-center text-blue-700 leading-6 ">
                        Notifcations
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {storeNotification && storeNotification.length > 0 ? storeNotification.map((noti, index) => {
                        return <div key={index} className="flex items-center justify-between gap-2" >

                          <div style={{ boxShadow: ` 5px 5px 10px rgba(0, 0, 0, 0.2)` }} className=" w-full bg-white cursor-pointer my-1  rounded-lg p-3 ">
                            <div className='flex items-center justify-between gap-2'>
                              <h5 className="font-semibold text-green-500">{noti.MessageHeading}</h5>
                              <span className='text-xs italic'>
                                {noti.messageTime.slice(4, 15)}
                              </span>
                            </div>
                            <div className="flex text-sm  my-2 items-center justify-start gap-1">
                              <p className=" ">
                                {noti.MessageContent}
                              </p>
                            </div>

                          </div>

                          {/* cross Svg */}
                          <div onClick={async () => {

                            try {
                              setloading(true)
                              const response = await axios.post(`${serverURL}/api/notifications/removeNotification/${noti._id}`, { userId: storeCurrentUser._id })
                              setloading(false)
                              if (response && response.status === 200) {
                                dispatch(removeNotification(noti));

                              }

                            } catch (error) {
                              setloading(false)
                            }
                          }} className="  cursor-pointer ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>

                        </div>
                      })
                        :
                        <div><p className='font-bold flex items-center justify-center'>No Notification </p></div>
                      }

                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    <Loader loading={loading} />
  </>
  )
}
