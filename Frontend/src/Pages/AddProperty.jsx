import { useState, useEffect, useRef } from "react";
import { useProps } from "../components/PropsContext";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from "../components/Header/Header";
import Footer from "../components/Footer";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import Dropdown from "../components/Dropdown";
import {facilities } from "../../Data/Data";
import { 
    PiPlus,
    PiUploadSimple,
    PiTrashSimple,
    PiXBold,
    PiCaretDown,
} from 'react-icons/pi';


function AddProperty() {

    const { user, url } = useProps();
    const navigate = useNavigate();

    const infoObject = { name: '', address: '', rooms: '', bathrooms: '', garages: '', yearBuilt: '', area: '', category: '', forSale: '', forRent: '', description: '' }
    const imgsObject = { img1: null, img2: null, img3: null, img4: null }
    
    
    // useRef hooks
    const inputOfImgs = useRef([]);
    
    // useState hooks 
    const [ isLoading, setIsLoading ] = useState(false);
    const [ imgs, setImgs ] = useState(imgsObject);
    const [ info, setInfo ] = useState(infoObject);
    const [ features, setFeatures ] = useState([{ title: '', description: '' }]);
    const [ insights, setInsights ] = useState([{ title: '', description: '' }]);
    const [ financials, setFinancials ] = useState([{ title: '', description: '' }]);
    const [ selected, setSeleted ] = useState(null);

    function handelChange(event) {
        setImgs({ ...imgs, [event.target.name]: event.target.files[0] });
    }

    const changeInfo = (event) => {
        setInfo({ ...info, [event.target.name]: event.target.value });
    }

    const changeItem = (event,type, field, index) => {

        if (type === 'feature') {
            const newFeatures = [...features];
            newFeatures[index][field] = event.target.value;
            setFeatures(newFeatures);
            return;
        }

        if (type === 'insight') {
            const newInsights = [...insights];
            newInsights[index][field] = event.target.value;
            setInsights(newInsights);
            return;
        }

        if (type === 'financial') {
            const newFinancial = [...financials];
            newFinancial[index][field] = event.target.value;
            setFinancials(newFinancial);
            return;
        }

    }

    const addItem = (event, type) => {
        event.preventDefault();

        const addItemAlert = () => {
            Alert('warning', `you can't add more than 10 ${type}s`)
        } 

        switch(type) {
            case 'feature':
                if (features.length < 10) {
                    setFeatures([ ...features, { title: '', description: '' } ]);
                } else {
                    addItemAlert();
                }
                break;
            case 'insight':
                if (insights.length < 10) {
                    setInsights([ ...insights, { title: '', description: '' } ])
                } else {
                    addItemAlert();
                }
                break;
            case 'financial':
                if (financials.length < 10) {
                    setFinancials([ ...financials, { title: '', description: '' } ]);
                } else {
                    addItemAlert();
                }
                break;
            default:
                break;
        }
    }

    const removeItem = (event, type, index) => {
        event.preventDefault();

        switch(type) {
            case 'feature':
                if (features.length > 1) {
                    setFeatures(features.filter((_, idx) => {
                        return idx !== index;
                    }));
                }
                break;
            case 'insight':
                if (insights.length > 1) {
                    setInsights(insights.filter((_, idx) => {
                        return idx !== index;
                    }));
                }
                break;
            case 'financial':
                if (financials.length > 1) {
                    setFinancials(financials.filter((_, idx) => {
                        return idx !== index;
                    }));
                }
                break;
            default: 
                break;
        }
    }

    const handleSelect = (value) => {
        setSeleted(value);
        setInfo({ ...info, category: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check images existing
        if (!Object.values(imgs).some((i) => i !== null)) {
            return (
                Alert('warning', 'please upload at least 1 image')
            )
        }

        // Check property information Fields
        for (const i of Object.values(info)) {
            if (!i) {
                return (
                    Alert('warning', 'please enter all property infromation')
                )
            }
        }
        
        // Check features List
        if (features.length === 1 && !features[0].title || !features[0].description) {
            return (
                Alert('warning', 'please enter at least 1 feature')
            )
        }

        // Check insights List
        if (insights.length === 1 && !insights[0].title || !insights[0].description) {
            return (
                Alert('warning', 'please enter at least 1 insight')
            )
        }

        // Check financials List
        if (financials.length === 1 && !financials[0].title || !financials[0].description) {
            return (
                Alert('warning', 'please enter at least 1 financial')
            )
        }

        const formData = new FormData();

        for (const [key, value] of Object.entries(info)) {
            formData.set(key, value);
        }

        for (const [key, value] of Object.entries(imgs)) {
            formData.set(key, value);
        }

        formData.set('features', JSON.stringify(features));
        formData.set('insights', JSON.stringify(insights));
        formData.set('financials', JSON.stringify(financials));

        setIsLoading(true);
        try {
            const res = (await axios.post(`${url}/api/property/upload`, formData, { withCredentials: true })).data;
            Alert('success', res.message);
        } catch (err) {
            console.log(err);
            Alert('error', err.response?.data?.message);
        } finally {
            setIsLoading(false);
        }

        setInfo(infoObject);
        setSeleted(null);
        setImgs(imgsObject);
        setFeatures([{ title: '', description: '' }]);
        setInsights([{ title: '', description: '' }]);
        setFinancials([{ title: '', description: '' }]);
    }


    useEffect(() => {
        return () => {
            Object.values(imgs).forEach((img) => {
                if (img) URL.revokeObjectURL(img);
            });
        }
    }, [imgs]);

    useEffect(() => {
		if (user.role !== 'agent') {
			navigate("/");
		}
	}, [user]);

    return (
        <main>
            <Header />
            <section className="w-full mt-26 lg:mt-36">
                <div className="w-full container mx-auto mb-25">
                    <div className="flex flex-col gap-1 mb-5 pb-3 border-b border-(--secondary-text)">
                        <h2 className="font-Playfair font-medium text-4xl text-(--primary-text) capitalize">new property</h2>
                        <h4 className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">Get Your Property Noticed by Adding It to Our Platform</h4>
                    </div>

                    <form encType="multipart/form-data" onSubmit={(event) => handleSubmit(event)} className={`relative w-full h-full grid grid-cols-12 gap-6`} >
                        <div className="col-span-12 lg:col-span-4">
                            <div className="w-full rounded-3xl border-1 border-(--secondary-text) p-5 mb-6">
                                <h3 className="font-Plus-Jakarta-Sans font-medium text-2xl text-(--primary-text) capitalize mb-4">Property Images</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {
                                        Object.keys(imgs).map((inputName, idx) => {
                                            return (
                                                <div key={inputName} className={idx === 0? 'col-span-3 h-48 sm:h-82 lg:h-70': 'col-span-1 h-24 sm:h-42 lg:h-28'}>
                                                    <div className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer duration-300 ease-in-out text-3xl text-(--primary-text) outline-2 outline-dashed outline-(--secondary-text) hover:outline-(--primary-color) hover:text-(--primary-color)">
                                                        <label htmlFor={inputName} className="w-full h-full flex items-center justify-center bg-[rgb(118,118,118,0.15)] cursor-pointer">
                                                            <PiPlus />
                                                        </label>
                                                        { imgs[inputName] && (
                                                            <div className="group absolute top-0 left-0 right-0 w-full h-full duration-300 ease-in-out z-30">
                                                                <img 
                                                                    src={URL.createObjectURL(imgs[inputName])}
                                                                    alt='Property Image'
                                                                    className="w-full h-full object-cover object-center"
                                                                />
                                                                <div className={`${idx === 0? 'gap-4': 'gap-2'} opacity-0 duration-300 ease-in-out group-hover:opacity-100 absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[rgb(41,44,51,0.7)]`}>
                                                                    <div onClick={() => inputOfImgs.current[idx].click()} className={`${idx === 0? 'w-14 h-14 text-3xl': 'w-8 h-8 text-lg'} flex items-center justify-center rounded-full duration-300 ease-in-out border-1 border-(--primary-text) text-(--primary-text) hover:border-(--primary-color) hover:text-(--primary-color)`}>
                                                                        <PiUploadSimple />
                                                                    </div>
                                                                    <div onClick={() => setImgs({ ...imgs, [inputName]: null })} className={`${idx === 0? 'w-14 h-14 text-3xl': 'w-8 h-8 text-lg'} flex items-center justify-center rounded-full duration-300 ease-in-out border-1 border-(--primary-text) text-(--primary-text) hover:border-[#DE350B] hover:text-[#DE350B]`}>
                                                                        <PiTrashSimple />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) }
                                                    </div>
                                                    <input type="file" onChange={handelChange} ref={(el) => inputOfImgs.current[idx] = el} id={inputName} name={inputName} maxLength={1} className="hidden" accept="image/png, image/jpeg, image/webp"/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="w-full rounded-3xl border-1 border-(--secondary-text) p-5">
                                <h3 className="font-Plus-Jakarta-Sans font-medium text-2xl text-(--primary-text) capitalize mb-4">facilities</h3>
                                <div className="w-full min-h-50 max-h-90 flex flex-col flex-wrap gap-4 mb-6">
                                    {
                                        facilities.map((facility, idx) => {
                                            return (
                                                <div className="flex items-center gap-3" key={idx}>
                                                    <input type="checkbox" id={facility} name={facility} className="relative appearance-none w-6 h-6 border-2 border-(--secondary-text) bg-[rgb(185,187,189,.10)] rounded-md checked:border-(--primary-color) before:absolute checked:before:content-['\2713'] before:text-(--primary-color) before:top-2/4 before:left-2/4 before:-translate-2/4"/>
                                                    <label htmlFor={facility} className="font-Plus-Jakarta-Sans font-medium text-base text-(--primary-text) capitalize">{ facility }</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-8 w-full rounded-3xl border-1 border-(--secondary-text) p-5">
                            <h3 className="font-Plus-Jakarta-Sans font-medium text-2xl text-(--primary-text) capitalize mb-4">About Property</h3>
                            <div className="flex flex-col gap-6 mb-8">

                                <section className="w-full grid grid-cols-12 gap-4">
                                    <div className="col-span-12 flex items-center gap-2">
                                        <span className="w-[3px] h-7 rounded-full bg-(--primary-color)"></span>
                                        <h3 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">property information</h3>
                                    </div>
                                    {
                                        Object.keys(info).map((infoField, idx) => {
                                            return (
                                                ([0, 1].includes(idx) &&
                                                    <div className='col-span-12 sm:col-span-6' key={'info-' + idx}>
                                                        <label htmlFor={infoField} className="inline-block font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize mb-2">{ infoField }</label>
                                                        <input type="text" onChange={(event) => changeInfo(event)} value={info[infoField]} name={infoField} id={infoField} placeholder={'property ' + infoField} className="font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-light placeholder:text-(--secondary-text)/75 capitalize w-full h-12 rounded-2xl border-1 border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]"/>
                                                    </div>
                                                ) ||
                                                ([2,3,4,5,6].includes(idx) && 
                                                    <div className='col-span-12 sm:col-span-6 xxl:col-span-4' key={'info-' + idx}>
                                                        <label htmlFor={infoField} className="inline-block font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize mb-2">{ infoField }</label>
                                                        <input type="text" onChange={(event) => changeInfo(event)} value={info[infoField]} name={infoField} id={infoField} placeholder={'property ' + infoField} className="font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-light placeholder:text-(--secondary-text)/75 capitalize w-full h-12 rounded-2xl border-1 border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]"/>
                                                    </div>
                                                ) ||
                                                ([8,9].includes(idx) && 
                                                    <div className='col-span-12 sm:col-span-6 xxl:col-span-4' key={'info-' + idx}>
                                                        <label htmlFor={infoField} className="inline-block font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize mb-2">Price</label>
                                                        <input type="text" onChange={(event) => changeInfo(event)} value={info[infoField]} name={infoField} id={infoField} placeholder={'price ' + infoField} className="font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-light placeholder:text-(--secondary-text)/75 capitalize w-full h-12 rounded-2xl border-1 border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]"/>
                                                    </div>
                                                ) ||
                                                (
                                                    idx == 7 &&
                                                    <div className='col-span-12 sm:col-span-6 xxl:col-span-4' key={'info-' + idx}>
                                                        <label htmlFor={infoField} className="inline-block font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize mb-2">{ infoField }</label>
                                                        <div className="relative w-full flex flex-col">
                                                            <Dropdown
                                                                items={['residential', 'commercial', 'industerial', 'investment']}
                                                                classes={'w-full'}
                                                                onSelect={handleSelect}
                                                            >
                                                                <div className={`${!selected? 'text-(--secondary-text)/75': 'text-(--primary-text)'} border-(--secondary-text) w-full h-12 flex items-center justify-between text-sm border-1 rounded-2xl px-4 cursor-pointer`}>
                                                                    <span className="font-Plus-Jakarta-Sans font-light capitalize">
                                                                        { !selected? 'choose category': selected }
                                                                    </span>
                                                                    <PiCaretDown />
                                                                </div>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                ) ||
                                                (idx === 10 && 
                                                    <div className='col-span-12' key={idx}>
                                                        <label htmlFor={infoField} className="inline-block font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize mb-2">{ infoField }</label>
                                                        <textarea type="text" onChange={(event) => changeInfo(event)} value={info[infoField]} name={infoField}  id={infoField} placeholder={'property ' + infoField} className="appearance-none font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-light placeholder:text-(--secondary-text)/75 capitalize w-full h-12 rounded-2xl border-1 border-(--secondary-text) py-3 px-4 focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]"/>
                                                    </div>
                                                )
                                            )
                                        })
                                    }
                                </section>

                                <section className="flex flex-col gap-4">
                                    <div className="col-span-12 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-[3px] h-7 rounded-full bg-(--primary-color)"></span>
                                            <h3 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">property features</h3>
                                        </div>
                                        <button onClick={(event) => addItem(event, 'feature')} className="flex items-center gap-1 hover:border-b-1 hover:border-(--primary-color)">
                                            <PiPlus className="text-xl text-(--primary-color)"/>
                                            <span className="hidden sm:block font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-color) capitalize cursor-pointer">
                                                add feature
                                            </span>
                                        </button>
                                    </div>
                                    <ul className="flex flex-col gap-4">
                                    {
                                        features.map((feature, idx) => {
                                            return (
                                                <li key={'feature-' + idx} className="relative w-full flex flex-col gap-3">
                                                    <input type="text" value={feature.title} onChange={(event) => changeItem(event, 'feature', 'title', idx)} id={'feature-' + idx} placeholder='feature title' className="w-1/2 font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-normal placeholder:text-(--secondary-text)/75 capitalize h-12 rounded-2xl border-1 border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]"/>
                                                    <input type="text" value={feature.description} onChange={(event) => changeItem(event, 'feature', 'description', idx)} id={'feature-' + idx} placeholder='feature description' className="col-span-12 font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-normal placeholder:text-(--secondary-text)/75 capitalize h-12 rounded-2xl border-1 border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]"/>
                                                    <div onClick={(event) => removeItem(event, 'feature', idx)} className="w-6 h-6 flex items-center justify-center absolute top-0 right-0 text-base duration-300 ease-in-out text-[#DE350B] hover:text-(--primary-text) bg-[rgb(222,53,110,.2)] hover:bg-[#DE350B]  rounded-lg cursor-pointer">
                                                        <PiXBold />
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                    </ul>
                                </section>

                                <section className="flex flex-col gap-4">
                                    <div className="col-span-12 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-[3px] h-7 rounded-full bg-(--primary-color)"></span>
                                            <h3 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">Neighborhood Insights</h3>
                                        </div>
                                        <button onClick={(event) => addItem(event, 'insight')} className="flex items-center gap-1 hover:border-b-1 hover:border-(--primary-color)">
                                            <PiPlus className="text-xl text-(--primary-color)"/>
                                            <span className="hidden sm:block font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-color) capitalize cursor-pointer">
                                                add insight
                                            </span>
                                        </button>
                                    </div>
                                    <ul className="flex flex-col gap-4">
                                    {
                                        insights.map((insight, idx) => {
                                            return (
                                                <li key={'insight-' + idx} className="relative w-full flex flex-col gap-3">
                                                    <input type="text" value={insight.title} onChange={(event) => changeItem(event, 'insight', 'title', idx)} id={'insight-' + idx} placeholder='insight title' className="w-1/2 font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-normal placeholder:text-(--secondary-text)/75 capitalize h-12 rounded-2xl border-1 border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]"/>
                                                    <input type="text" value={insight.description} onChange={(event) => changeItem(event, 'insight', 'description', idx)} id={'insight-' + idx} placeholder='insight description' className="col-span-12 font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-normal placeholder:text-(--secondary-text)/75 capitalize h-12 rounded-2xl border-1 border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]"/>
                                                    <div onClick={(event) => removeItem(event, 'insight', idx)} className="w-6 h-6 flex items-center justify-center absolute top-0 right-0 text-base duration-300 ease-in-out text-[#DE350B] hover:text-(--primary-text) bg-[rgb(222,53,110,.2)] hover:bg-[#DE350B]  rounded-lg cursor-pointer">
                                                        <PiXBold />
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                    </ul>
                                </section>

                                <section className="flex flex-col gap-4">
                                    <div className="col-span-12 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-[3px] h-7 rounded-full bg-(--primary-color)"></span>
                                            <h3 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">financial information</h3>
                                        </div>
                                        <button onClick={(event) => addItem(event, 'financial')} className="flex items-center gap-1 hover:border-b-1 hover:border-(--primary-color)">
                                            <PiPlus className="text-xl text-(--primary-color)"/>
                                            <span className="hidden sm:block font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-color) capitalize cursor-pointer">
                                                add financial
                                            </span>
                                        </button>
                                    </div>
                                    <ul className="flex flex-col gap-4">
                                    {
                                        financials.map((financial, idx) => {
                                            return (
                                                <li key={'financial-' + idx} className="relative w-full flex flex-col gap-3">
                                                    <input type="text" value={financial.title} onChange={(event) => changeItem(event, 'financial', 'title', idx)} id={'financial-' + idx} placeholder='insight title' className="w-1/2 font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-normal placeholder:text-(--secondary-text)/75 capitalize h-12 rounded-2xl border-1 border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]"/>
                                                    <input type="text" value={financial.description} onChange={(event) => changeItem(event, 'financial', 'description', idx)} id={'financial-' + idx} placeholder='insight description' className="col-span-12 font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-normal placeholder:text-(--secondary-text)/75 capitalize h-12 rounded-2xl border-1 border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]"/>
                                                    <div onClick={(event) => removeItem(event, 'financial', idx)} className="w-6 h-6 flex items-center justify-center absolute top-0 right-0 text-base duration-300 ease-in-out text-[#DE350B] hover:text-(--primary-text) bg-[rgb(222,53,110,.2)] hover:bg-[#DE350B]  rounded-lg cursor-pointer">
                                                        <PiXBold />
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                    </ul>
                                </section>
                                
                            </div>
                            <div className="w-full flex justify-end">
                                <button type="submit" className={`${isLoading? '!bg-(--primary-color)/50 h-13': ''} mainBtn`}>
                                    <div className="w-full h-full flex items-center justify-center gap-3">
                                        <div className={`${isLoading? 'block': 'hidden'} relative h-4 w-4 animate-spin`}>
                                            <div className="absolute top-0 left-0 w-4 h-4 rounded-full border-2 border-(--primary-text) border-t-transparent"></div>
                                        </div>
                                        <span className={`${isLoading? 'hidden' : 'block'}`}>upload</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            <Footer />
        </main>
    )
}

export default AddProperty