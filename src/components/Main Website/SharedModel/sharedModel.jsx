import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
const WebSite_Domain = process.env.REACT_APP_WEB_DOMAIN



export default function SharedModel(props) {
    const cancelButtonRef = useRef(null)
    const [copied, setCopied] = useState(false)

    return (<>
        <Transition.Root show={props.SharePostOpen} as={Fragment}>
            <Dialog as="div" style={{ zIndex: 14000 }} className="relative " initialFocus={cancelButtonRef} onClose={props.setSharePostOpen}>
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
                                <div className="bg-white  p-2">
                                    <div className="text-center">
                                        <h2 as="h3" className="text-base font-semibold text-center w-full leading-6 text-gray-900">
                                            Share Post
                                        </h2>
                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <input type="text" value={`${WebSite_Domain}/page/posts/${props.SharedpostID}`} name="postlink" disabled id="postlink" className='text-blue-600  bg-gray-200 italic p-2 focus:outline-none border-2 rounded border-black w-full' />

                                        </div>
                                        <div className='mt-2 flex items-center justify-center gap-2'>
                                            <button onClick={async () => {
                                                setCopied(true)

                                                navigator.clipboard.writeText(`${WebSite_Domain}/page/posts/${props.SharedpostID}`)

                                                setTimeout(() => {
                                                    setCopied(false)
                                                    props.setSharePostOpen(false)
                                                }, 1000);
                                            }} className='p-2 border border-black rounded-md '>
                                                {copied ?
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                    </svg>
                                                    :
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                                    </svg>
                                                }
                                            </button>
                                            <a
                                                // href={`//api.whatsapp.com/send?phone=+923306146540&amp;text=${encodeURIComponent(`${WebSite_Domain}/page/Posts/${encodeURIComponent(props.SharedpostID)}`)}`}
                                                // https://web.whatsapp.com/send?phone=number&text=message&app_absent=0
                                                // https://web.whatsapp.com/send?text=https://www.upwork.com/freelancers/~019ce609280ba81446?mp_source=share
                                                href={`https://web.whatsapp.com/send?text=${`${WebSite_Domain}/page/posts/${encodeURIComponent(props.SharedpostID)}?mp_source=share`}`}
                                                // href={`https://web.whatsapp.com/send?phone=${props.mobileNumberm}&text=${`${WebSite_Domain}/page/posts/${encodeURIComponent(props.SharedpostID)}&app_absent=0`}`}
                                                title="view "
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={39}
                                                    height={30}
                                                    fill="green"
                                                    className="bi bi-whatsapp"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                                                </svg>
                                            </a>
                                            <a
                                                // const facebookShareUrl = ``;

                                                href={`https://www.facebook.com/sharer/sharer.php?u=https://real-deal-exchange-web.vercel.app/page/posts/${encodeURIComponent(props.SharedpostID)}/&amp`}
                                                title="view"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={30}
                                                    height={30}
                                                    fill="blue"
                                                    className="bi bi-facebook"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                                                </svg>
                                            </a>
                                         

                                        </div>
                                    </div>

                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    </>)
}
