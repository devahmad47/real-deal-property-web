import { Fragment, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { selecteCurrentUser, addPost, addgroupData } from '../../Store/authSlice'
import axios from 'axios'
import { Loader } from '../Loader/loader'
import { toast } from "react-toastify"
import imageCompression from 'browser-image-compression';
import { useParams, useNavigate } from 'react-router-dom'

const serverURL = process.env.REACT_APP_SERVER_URL

export function CreatePost() {

    const { origin, groupId } = useParams();
    const fileInputRef = useRef(null);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setloading] = useState(false);
    const [MonthlyPMTEnable, setMonthlyPMTEnable] = useState(false);
    const [loanTypeEnable, setloanTypeEnable] = useState(false);
    const [SubtooEnable, setSubtooEnable] = useState(false);
    const [fixNEnable, setfixNEnable] = useState(false);
    const StoreCurrentUser = useSelector(selecteCurrentUser)
    // const cancelButtonRef = useRef(null)
    const invesmentTypes = [
        { value: "Buy and hold", label: "Buy and hold" },
        { value: "Subto", label: "Subto" },
        { value: "Fix N' Flip", label: "Fix N' Flip" },
        // { value: "Wholesale", label: "Wholesale" },
    ]
    const listingFeature = [
        { value: "SFR", label: "SFR" },
        { value: "Townhome", label: "Townhome" },
        { value: "Condo", label: "Condo" },
        { value: "Multiple Dwellings", label: "Multiple Dwellings" },
        { value: "Land", label: "Land" },
        { value: "Other", label: "Other" },
    ]
    const HAOfeatures = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ]
    const LoadTypeFeatures = [
        { value: "Conventional", label: "Conventional" },
        { value: "FHA", label: "FHA" },
        { value: "VA", label: "VA" },
        { value: "Assumable", label: "Assumable" },
        { value: "Seller Finnace", label: "Seller Finnace" },
        { value: "Cash", label: "Cash" },
        { value: "Other", label: "Other" },
    ]
    const SaleTypeFeatures = [
        { value: "Subto", label: "Subto" },
        { value: "SubWrap", label: "SubWrap" },
    ]


    const intialpost = {

        postDescription: "",
        CreatorID: StoreCurrentUser._id,
        postDealType: "",
        mediaType: '',
        Postmedia: [],
        Price: 0,
        mediaSize: 0,
        postedBy: "",
        userProfileImageSrc: "",
        postCreated: '',
        DwellingStyle: "",
        city: "",
        zipCode: 0,
        state: "",
        NoOfBedromoms: 0,
        NoOfBathrooms: 0,
        NoOfInteriorLevel: 0,
        yearOfBuilt: 0,
        Approx_SQFT: 0,
        HAO_Feature: "",
        Monthly_PMT: 0,
        Garage_Spaces: 0,
        Pool: "",
        Basement: "",
        Repair_Needs: "",
        Loan_Type: "",
        close_of_Escrow: "",
        other_Terms: "",
        Estimated_Rents: 0,
        Sale_Type: "",
        Payment_PITI: 0,
        Interest_Rate: 0,
        Mortgage_Balance: 0,
        Loan_Term: 0,
        Loan_Balance: 0,
        Est_Repairs: 0,
        ARV: 0,
        Down_Payment: 0,
        Est_Closing_Costs_Buy: 0,
        Est_Closing_Costs_Sell: 0,
        Est_Profit: 0,
        YearBuilt: 0,


    }
    const [createPostData, setCreatePostData] = useState(intialpost)


    useEffect(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            fileInputRef.current.setAttribute('capture', 'camera');
        } else {
            fileInputRef.current.removeAttribute('capture');
        }
    }, []);
    async function handelSubmit(e) {
        e.preventDefault();
        // props.setOpen(false)

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
            formData.append('Postmedia', createPostData.Postmedia);
            formData.append('postDescription', createPostData.postDescription);
            formData.append('CreatorID', createPostData.CreatorID);
            formData.append('postDealType', createPostData.postDealType);
            formData.append('Price', createPostData.Price);
            formData.append('location', createPostData.location);


            // formData.append('postCreated', `${new Date()}`);
            formData.append('postedBy', StoreCurrentUser.username);
            formData.append('userProfileImageSrc', StoreCurrentUser.profileImageUrl);

            createPostData.DwellingStyle && formData.append('DwellingStyle', createPostData.DwellingStyle);
             formData.append('YearBuilt', createPostData.YearBuilt);
            createPostData.city && formData.append('city', createPostData.city);
            createPostData.zipCode && formData.append('zipCode', createPostData.zipCode);
            createPostData.state && formData.append('state', createPostData.state);
            createPostData.NoOfBedromoms && formData.append('NoOfBedromoms', createPostData.NoOfBedromoms);
            createPostData.NoOfBathrooms && formData.append('NoOfBathrooms', createPostData.NoOfBathrooms);
            createPostData.NoOfInteriorLevel && formData.append('NoOfInteriorLevel', createPostData.NoOfInteriorLevel);
            createPostData.yearOfBuilt && formData.append('yearOfBuilt', createPostData.yearOfBuilt);
            createPostData.Approx_SQFT && formData.append('Approx_SQFT', createPostData.Approx_SQFT);
            createPostData.HAO_Feature && formData.append('HAO_Feature', createPostData.HAO_Feature);
            createPostData.Monthly_PMT && formData.append('Monthly_PMT', createPostData.Monthly_PMT);

            createPostData.Garage_Spaces && formData.append('Garage_Spaces', createPostData.Garage_Spaces);
            createPostData.Pool && formData.append('Pool', createPostData.Pool);
            createPostData.Basement && formData.append('Basement', createPostData.Basement);
            createPostData.Repair_Needs && formData.append('Repair_Needs', createPostData.Repair_Needs);
            createPostData.Loan_Type && formData.append('Loan_Type', createPostData.Loan_Type);
            createPostData.close_of_Escrow && formData.append('close_of_Escrow', createPostData.close_of_Escrow);

            createPostData.other_Terms && formData.append('other_Terms', createPostData.other_Terms);
            createPostData.Estimated_Rents && formData.append('Estimated_Rents', createPostData.Estimated_Rents);
            createPostData.Sale_Type && formData.append('Sale_Type', createPostData.Sale_Type);
            createPostData.Payment_PITI && formData.append('Payment_PITI', createPostData.Payment_PITI);
            createPostData.Interest_Rate && formData.append('Interest_Rate', createPostData.Interest_Rate);
            createPostData.Mortgage_Balance && formData.append('Mortgage_Balance', createPostData.Mortgage_Balance);

            createPostData.Loan_Term && formData.append('Loan_Term', createPostData.Loan_Term);
            createPostData.Loan_Balance && formData.append('Loan_Balance', createPostData.Loan_Balance);
            createPostData.Est_Repairs && formData.append('Est_Repairs', createPostData.Est_Repairs);
            createPostData.ARV && formData.append('ARV', createPostData.ARV);
            createPostData.Down_Payment && formData.append('Down_Payment', createPostData.Down_Payment);
            createPostData.Est_Closing_Costs_Buy && formData.append('Est_Closing_Costs_Buy', createPostData.Est_Closing_Costs_Buy);
            createPostData.Est_Closing_Costs_Sell && formData.append('Est_Closing_Costs_Sell', createPostData.Est_Closing_Costs_Sell);
            createPostData.Est_Profit && formData.append('Est_Profit', createPostData.Est_Profit);

            if (origin === 'home') {

                const response = await axios.post(`${serverURL}/api/posts/Create_post`, formData, {
                    headers: 'multipart/form-data'
                })
                setloading(false)
                if (response && response.status === 200) {
                    toast.success(response.data.message);
                    dispatch(addPost(response.data.post))

                }
            } else {
                const response = await axios.post(`${serverURL}/api/groupsPost/${groupId}/Create_Discussion_post`, formData)
                setloading(false)
                if (response && response.status === 200) {
                    toast.success(response.data.message);
                    dispatch(addgroupData({ groupId, group: response.data.group }))
                }
            }


        } catch (error) {
            setloading(false);
            if (error) {
                if (error.response) {
                    toast.error(error.response.data.message);
                   
                } else {
                    toast.error("Failed to Create Post");
                }
            }
        }
        // props.setOpen(false)
        setCreatePostData(intialpost)
        if (origin === 'home') {
            navigate("/page/Home")
        } else {
            navigate(`page/Groups/${groupId}/Discussion`)

        }
    }

    const handleFileChange = async (e) => {
        const selectedFiles = e.target.files;

        setCreatePostData((prevData) => ({ ...prevData, Postmedia: Array.from(selectedFiles) }));
    };

    return (<>
        <form onSubmit={handelSubmit}>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 my-2 sm:pb-4">
                <h2 className='text-center font-bold text-blue-700'>Create Post</h2>
                <div className="grid grid-cols-2  gap-2 my-2">
                    <div className="col-span-2 md:col-span-1">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">Deal Type</h2>
                        </div>
                        <Select
                            required
                            onChange={(e) => {
                                setCreatePostData((pre) => ({ ...pre, postDealType: e.value }))
                                if (e.value === "Buy and hold") {
                                    setloanTypeEnable(true)
                                } else {
                                    setloanTypeEnable(false)
                                }
                                if (e.value === "Subto") {
                                    setSubtooEnable(true)
                                } else {
                                    setSubtooEnable(false)
                                }
                                if (e.value === "Fix N' Flip") {
                                    setfixNEnable(true)
                                } else {
                                    setfixNEnable(false)
                                }
                            }}
                            className={` w-full `} options={invesmentTypes}
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">Dwelling Feature</h2>
                        </div>
                        <Select
                            required
                            onChange={async (e) => {
                                setCreatePostData((pre) => ({ ...pre, DwellingStyle: e.value }))
                            }}

                            className={` w-full `} options={listingFeature}
                        />
                    </div>
                    <div className=" p-2 col-span-2 md:col-span-1">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">City</h2>
                        </div>
                        <div>
                            <input
                                required
                                value={createPostData.city}
                                onChange={(e) => {
                                    setCreatePostData((pre) => ({ ...pre, city: e.target.value }))
                                }}
                                type="text" className=" text-sm focus:outline-none focus:ring-2 ring-blue-500 w-full p-1 px-2 border rounded  focus:shadow-none " placeholder="London" />
                        </div>
                    </div>
                    <div className=" p-2 col-span-2 md:col-span-1">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">ZipCode</h2>
                        </div>
                        <div>
                            <input
                                required
                                value={createPostData.zipCode}
                                onChange={(e) => {
                                    setCreatePostData((pre) => ({ ...pre, zipCode: e.target.value }))
                                }}
                                type="text" className=" text-sm focus:outline-none focus:ring-2 ring-blue-500 w-full p-1 px-2 border rounded  focus:shadow-none " placeholder="xxxxxx" />
                        </div>
                    </div>
                    <div className=" p-2 col-span-2 ">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">State</h2>
                        </div>
                        <div>
                            <input
                                required
                                value={createPostData.state}
                                onChange={(e) => {
                                    setCreatePostData((pre) => ({ ...pre, state: e.target.value }))
                                }}
                                type="text" className=" text-sm focus:outline-none focus:ring-2 ring-blue-500 w-full p-1 px-2 border rounded  focus:shadow-none " placeholder="Punjab" />
                        </div>
                    </div>
                    <div className=" p-1 col-span-2 md:col-span-1 ">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">No of BedRooms</h2>
                        </div>
                        <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                            <input
                                required
                                value={createPostData.NoOfBedromoms}
                                onChange={(e) => {
                                    setCreatePostData((pre) => ({ ...pre, NoOfBedromoms: e.target.value }))
                                }}
                                type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter BedRooms" />

                        </div>
                    </div>
                    <div className=" p-1 col-span-2 md:col-span-1 ">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">No of BathRooms</h2>
                        </div>
                        <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                            <input
                                required
                                value={createPostData.NoOfBathrooms}
                                onChange={(e) => {
                                    setCreatePostData((pre) => ({ ...pre, NoOfBathrooms: e.target.value }))
                                }}
                                type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter BathRooms" />

                        </div>
                    </div>
                    <div className=" p-1 col-span-2 md:col-span-1 ">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">Total Marla</h2>
                        </div>
                        <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                            <input
                                required
                                value={createPostData.Approx_SQFT}
                                onChange={(e) => {
                                    setCreatePostData((pre) => ({ ...pre, Approx_SQFT: e.target.value }))
                                }}
                                type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter SQFT" />

                        </div>
                    </div>
                    <div className=" p-1 col-span-2 md:col-span-1 ">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">Built Year</h2>
                        </div>
                        <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                            <input
                                required
                                value={createPostData.YearBuilt}
                                onChange={(e) => {
                                    setCreatePostData((pre) => ({ ...pre, YearBuilt: e.target.value }))
                                }}
                                type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Year Built" />

                        </div>
                    </div>

                    <div className="p-1 col-span-2">
            <div className="text-left text-sm my-1 px-2 font-semibold">
                <h2 className="italic">Choose Post Media</h2>
            </div>
            <div>
                <input
                    required
                    onChange={handleFileChange}
                     ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*, video/*"
                    className="bg-white w-full p-1 px-2 rounded italic border hover:border-blue-500 hover:shadow-none"
                />
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
                    <h2 className='text-center col-span-2 text-blue-700 font-bold'>
                        Special Listing Features:
                    </h2>
                    <div className="col-span-2 md:col-span-1">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">HOA</h2>
                        </div>
                        <Select
                            required
                            onChange={async (e) => {
                                setCreatePostData((pre) => ({ ...pre, HAO_Feature: e.value }))
                                if (e.value === 'Yes') {
                                    setMonthlyPMTEnable(true)
                                } else {
                                    setMonthlyPMTEnable(false)
                                }
                            }}

                            className={` w-full `} options={HAOfeatures}
                        />
                    </div>

                    {MonthlyPMTEnable && <div className=" p-1 col-span-2 md:col-span-1 ">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">Monthly PMT</h2>
                        </div>
                        <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                            <input
                                required
                                value={createPostData.Monthly_PMT}
                                onChange={(e) => {
                                    setCreatePostData((pre) => ({ ...pre, Monthly_PMT: e.target.value }))
                                }}
                                type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Monthly PMT" />

                        </div>
                    </div>}
                    <div className=" p-1 col-span-2 md:col-span-1 ">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">Garage Spaces</h2>
                        </div>
                        <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                            <input
                                required
                                value={createPostData.Garage_Spaces}
                                onChange={(e) => {
                                    setCreatePostData((pre) => ({ ...pre, Garage_Spaces: e.target.value }))
                                }}
                                type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Garage Space" />

                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">Pool</h2>
                        </div>
                        <Select
                            required
                            onChange={async (e) => {
                                setCreatePostData((pre) => ({ ...pre, Pool: e.value }))
                            }}

                            className={` w-full `} options={HAOfeatures}
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">Basement</h2>
                        </div>
                        <Select
                            required
                            onChange={async (e) => {
                                setCreatePostData((pre) => ({ ...pre, Basement: e.value }))
                            }}

                            className={` w-full `} options={HAOfeatures}
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">Repair Needs</h2>
                        </div>
                        <Select
                            required
                            onChange={async (e) => {
                                setCreatePostData((pre) => ({ ...pre, Repair_Needs: e.value }))
                            }}

                            className={` w-full `} options={HAOfeatures}
                        />
                    </div>

                    <h2 className='text-center col-span-2 text-blue-700 font-bold'>
                        Terms:
                    </h2>

                    <div className=" p-1 col-span-2 md:col-span-1 ">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">List Price</h2>
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
                                Rs
                            </span>
                        </div>
                    </div>
                    <div className=" p-1 col-span-2 md:col-span-1 ">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">Close of Escrow C.O.E.</h2>
                        </div>
                        <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                            <input
                                required
                                value={createPostData.close_of_Escrow}
                                onChange={(e) => {
                                    setCreatePostData((pre) => ({ ...pre, close_of_Escrow: e.target.value }))
                                }}
                                type="Date" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Date" />

                        </div>
                    </div>
                    {
                        loanTypeEnable && <>

                            <div className="col-span-2 md:col-span-1">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">New Loan Type:</h2>
                                </div>
                                <Select
                                    required
                                    onChange={async (e) => {
                                        setCreatePostData((pre) => ({ ...pre, Loan_Type: e.value }))

                                    }}

                                    className={` w-full `} options={LoadTypeFeatures}
                                />
                            </div>
                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Estimated Rents</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.Estimated_Rents}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({ ...pre, Estimated_Rents: e.target.value }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Estimated Rents" />

                                </div>
                            </div>

                        </>
                    }



                    {
                        SubtooEnable && < >


                            <div className="col-span-2 md:col-span-1">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Sale Type:</h2>
                                </div>
                                <Select
                                    required
                                    onChange={async (e) => {
                                        setCreatePostData((pre) => ({ ...pre, Sale_Type: e.value }))

                                    }}

                                    className={` w-full `} options={SaleTypeFeatures}
                                />
                            </div>
                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Estimated Rents</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.Estimated_Rents}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({ ...pre, Estimated_Rents: e.target.value }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Estimated Rents" />

                                </div>
                            </div>

                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Payment (PITI)</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.Payment_PITI}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({ ...pre, Payment_PITI: e.target.value }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Payment (PITI)" />

                                </div>
                            </div>
                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Interest Rate</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.Interest_Rate}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({ ...pre, Interest_Rate: e.target.value }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Interest Rate" />

                                </div>
                            </div>
                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Mortgage Balance</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.Mortgage_Balance}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({ ...pre, Mortgage_Balance: e.target.value }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Mortgage Balance" />

                                </div>
                            </div>
                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Loan Term (Years)</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.Loan_Term}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({ ...pre, Loan_Term: e.target.value }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Loan Term " />

                                </div>
                            </div>
                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Other Loan Balance</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.Loan_Balance}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({ ...pre, Loan_Balance: e.target.value }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Other Loan Balance" />

                                </div>
                            </div>
                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Est. Repairs</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.Est_Repairs}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({ ...pre, Est_Repairs: e.target.value }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Est. Repairs" />

                                </div>
                            </div>
                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">ARV</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.ARV}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({ ...pre, ARV: e.target.value }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter ARV" />

                                </div>
                            </div>
                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Down Payment (Entry Fee)</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.Down_Payment}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({ ...pre, Down_Payment: e.target.value }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Down Payment" />

                                </div>
                            </div>


                        </>
                    }
                    {
                        fixNEnable &&
                        <>
                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Est. Repairs</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.Est_Repairs}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({ ...pre, Est_Repairs: e.target.value }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Est. Repairs" />

                                </div>
                            </div>

                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">ARV</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.ARV}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({ ...pre, ARV: e.target.value }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter ARV" />

                                </div>
                            </div>
                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Est. Closing Costs (Buy)</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.Est_Closing_Costs_Buy}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({ ...pre, Est_Closing_Costs_Buy: e.target.value }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Est. Closing Costs Buy" />

                                </div>
                            </div>
                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Est. Closing Costs (Sell)</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        required
                                        value={createPostData.Est_Closing_Costs_Sell}
                                        onChange={(e) => {
                                            setCreatePostData((pre) => ({
                                                ...pre, Est_Closing_Costs_Sell: e.target.value
                                            }))

                                            const newProfit = createPostData.ARV - createPostData.Est_Repairs - (createPostData.Est_Closing_Costs_Buy + createPostData.Est_Closing_Costs_Sell)

                                            setCreatePostData((pre) => ({ ...pre, Est_Profit: newProfit }))
                                        }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Est. Closing Costs Sell " />

                                </div>
                            </div>
                            <div className=" p-1 col-span-2 md:col-span-1 ">
                                <div className="text-left text-sm my-1 px-2 font-semibold">
                                    <h2 className="italic">Est. Profit</h2>
                                </div>
                                <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                                    <input
                                        readOnly
                                        value={createPostData.Est_Profit}
                                        // onChange={(e) => {
                                        //     setCreatePostData((pre) => ({ ...pre, Est_Profit: e.target.value }))
                                        // }}
                                        type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter Est. Closing Costs Sell " />

                                </div>
                            </div>



                        </>
                    }
                    <div className=" p-1 col-span-2  ">
                        <div className="text-left text-sm my-1 px-2 font-semibold">
                            <h2 className="italic">Other</h2>
                        </div>
                        <div className="flex border  hover:border-2 hover:border-blue-500 items-center justify-between p-1 bg-white rounded hover:shadow-none  px-2  ">
                            <textarea
                                rows={3}
                                required
                                value={createPostData.other_Terms}
                                onChange={(e) => {
                                    setCreatePostData((pre) => ({ ...pre, other_Terms: e.target.value }))
                                }}
                                type="Number" className=" w-full    focus:shadow-none focus:outline-none " placeholder="Enter other Terms" />

                        </div>
                    </div>
                    {/* <div className='flex justify-end items-center border-2 '>

                    </div> */}
                    <button
                        type="submit"
                        className="border-0 hover:border-2 w-full justify-center col-span-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    >
                        Add Post
                    </button>

                </div>
            </div>


        </form>
        <Loader loading={loading} />
    </>)
}
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