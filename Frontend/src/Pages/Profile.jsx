import { useState } from "react";
import { useProps } from "../components/PropsProvider";
import {
	PiFacebookLogoLight,
	PiInstagramLogoLight,
	PiXLogoLight,
    PiPencilSimpleLight,
	PiPlus,
	PiXBold,
	PiX,
	PiGraduationCap,
	PiFunnel
} from "react-icons/pi";
import { languages } from "../../Data/Data";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
// Components
import Dropdown from "../components/Dropdown";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import BookingCard from "../components/BookingCard";

function Profile() {

	const info = { 
		name: '', 
		phone: '', 
		address: '', 
		age: '', 
		gender: '', 
		jobTitle: '', 
		aboutMe: '' 
	};

	const { 
		user, 
		setUser, 
		isLoading,
		setIsLoading
	} 
	= useProps();
	const navigate = useNavigate();

	// Property form states
	const [ img, setImg ] = useState(null);
	const [ imgPreview, setImgPreview ] = useState(user.picture);
	const [ editProfile, setEditProfile ] = useState(false);
	const [ socials, setSocials ] = useState({ facebook: '', instagram: '', twitterX: '' });
	const [ personalInfo, setPersonalInfo ] = useState(info);
	const [ certifications, setCertifications ] = useState(user.certifications);
	const [ languageSearch, setLanguageSearch ] = useState('');
	const [ selectedLanguages, setSelectedLanguages ] = useState([]);
	// const [ openModal, setOpenModal ] = useState(false);

	// Profile nav states
	const [ profileTab, setProfileTab ] = useState('overview');
	const [ bookings, setBookings ] = useState([]);

	const changeCertification = (event, index) => {
		const newCertifications = [...certifications];
		newCertifications[index][event.target.name] = event.target.value;
		setCertifications(newCertifications);
	}

	const addCertification = (event) => {
		event.preventDefault();
		setCertifications([ ...certifications, { name: '', department: '', description: '' } ]);
	}

	const removeCertification = (event, idx) => {
		event.preventDefault();
		setCertifications(certifications.filter((e, index) => index !== idx));
	}

	const handleSelect = (value) => {
		if (!selectedLanguages.includes(value)) {
			setSelectedLanguages([ ...selectedLanguages, value ]);
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		// Personal Infomation checking
		const formData = new FormData();

		for (const [key, value] of Object.entries(personalInfo)) {
			formData.set(key, value);
		}

		formData.set('profileImg', img);
		formData.set('socials', JSON.stringify(socials));
		formData.set('languages', JSON.stringify(selectedLanguages));
		formData.set('certifications', JSON.stringify(certifications));

		try {
			setIsLoading(true);
			const { data: { user, message } } = await api.post(
				`/api/users/update`,
				formData,
			);
			Alert('success', message);
			setUser(user);
		} catch (err) {
			Alert('warning', err.response?.data?.message);
			if (err.response.status === 404) {
				navigate('/');
			}
		} finally {
			setIsLoading(false);
		}

	}

	useEffect(() => {
		const getBookings = async () => {
			try {
				const { data: { bookings } } = await api.get(
					`/api/booking/get`,
				);

				setBookings(bookings);
			} catch (err) {
				console.log(err);
			}
		}

		if (profileTab.includes('bookings')) {
			getBookings();
		}
	}, [profileTab]);

	return (
		<main>
			<Header />
			<section className="w-full bg-(--bg-color) mt-36 mb-25">
				<div className="grid grid-cols-12 container mx-auto gap-6">

					<div className="col-span-12 lg:col-span-4">
						<div className="w-full flex flex-col items-center rounded-3xl border border-(--secondary-text) p-4 sm:p-6">
							<div className="flex flex-col items-center mb-4 relative aspect-square">
								<div className="relative before:absolute before:w-4 before:h-4 before:rounded-full before:bg-(--primary-color) before:right-1/4 before:bottom-1 before:z-10 before:border-3 before:border-(--bg-color)">
									<img
										src={imgPreview}
										alt="image"
										className="w-42 h-42 sm:w-56 sm:h-56 rounded-full border-2 border-(--primary-color) object-cover object-center"
									/>
								</div>
								<label htmlFor="profileImg" className={editProfile? 'absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center text-xl text-(--primary-color) rounded-full cursor-pointer border-1 border-(--primary-color) bg-(--bg-color)': 'hidden'}>
									<PiPencilSimpleLight />
								</label>
								<input type="file" onChange={(event) => { setImgPreview(URL.createObjectURL(event.target.files[0])); setImg(event.target.files[0]) }} id="profileImg" className="hidden" accept="image/png, image/jpeg, image/webp" maxLength={1}/>
							</div>
							<h2 className="font-Plus-Jakarta-Sans font-medium text-2xl sm:text-3xl text-(--primary-text) capitalize text-center mb-1">
								{user.name}
							</h2>
							<h3 className="font-Plus-Jakarta-Sans font-normal text-base sm:text-lg text-(--secondary-text) capitalize text-center mb-4">
								{user.jobTitle}
							</h3>
							<button
								onClick={() => setEditProfile(!editProfile)}
								className="w-full h-13 font-Playfair font-bold capitalize text-lg leading-0 text-(--black-color) bg-(--primary-color) rounded-[20px] border-2 border-(--primary-color) duration-300 ease-in-out hover:scale-95 hover:text-(--primary-color) hover:bg-transparent cursor-pointer"
							>
								{ editProfile? 'cancel editing': 'edit profile' }
							</button>
							<ul className="w-full my-5">
								<h4 className="font-Plus-Jakarta-Sans font-normal text-xl sm:text-2xl text-(--primary-text) capitalize mb-3 sm:mb-5">
									contact details
								</h4>
								<li className="flex flex-col gap-1 mb-3">
									<h4 className="font-Plus-Jakarta-Sans font-normal text-lg sm:text-xl text-(--primary-text) capitalize">
										email
									</h4>
									<h6 className="font-Plus-Jakarta-Sans font-light text-lg sm:text-xl text-(--secondary-text) overflow-x-scroll scrollbar-none">
										{user.email}
									</h6>
								</li>
								<li className="flex flex-col gap-1 mb-3">
									<h4 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">
										address
									</h4>
									<h6 className="font-Plus-Jakarta-Sans font-light text-xl text-(--secondary-text) overflow-x-scroll scrollbar-none">
										{user.address}
									</h6>
								</li>
								<li className="flex flex-col gap-1">
									<h4 className="font-Plus-Jakarta-Sans font-normal text-lg sm:text-xl text-(--primary-text) capitalize">
										phone
									</h4>
									<h6 className="font-Plus-Jakarta-Sans font-light text-lg sm:text-xl text-(--secondary-text) overflow-x-scroll scrollbar-none">
										{user.phone}
									</h6>
								</li>
							</ul>
							<div className="w-full">
								<h4 className="font-Plus-Jakarta-Sans font-normal text-xl sm:text-2xl text-(--primary-text) capitalize mb-3 sm:mb-5">
									social links
								</h4>
								<div className="flex items-center gap-2">
									<a
										href={user.socialMediaHandles.facebook}
										target="_blank"
									>
										<div className={`${user.socialMediaHandles.facebook? 'text-(--primary-color) border-(--primary-color)': 'text-(--primary-text) border-(--primary-text) hover:border-(--primary-color)'} w-12 h-12 flex items-center justify-center rounded-full border-1 duration-300 ease-in-out hover:scale-95 hover:text-(--bg-text) hover:bg-(--primary-color)`}>
											<PiFacebookLogoLight className="text-2xl" />
										</div>
									</a>
									<a href={user.socialMediaHandles.instagram} target="_blank">
										<div className={`${user.socialMediaHandles.instagram? 'text-(--primary-color) border-(--primary-color)': 'text-(--primary-text) border-(--primary-text) hover:border-(--primary-color)'} w-12 h-12 flex items-center justify-center rounded-full border-1 duration-300 ease-in-out hover:scale-95 hover:text-(--bg-text) hover:bg-(--primary-color)`}>
											<PiInstagramLogoLight className="text-2xl" />
										</div>
									</a>
									<a href={user.socialMediaHandles.twitterX} target="_blank">
										<div className={`${user.socialMediaHandles.twitterX? 'text-(--primary-color) border-(--primary-color)': 'text-(--primary-text) border-(--primary-text) hover:border-(--primary-color)'} w-12 h-12 flex items-center justify-center rounded-full border-1 duration-300 ease-in-out hover:scale-95 hover:text-(--bg-text) hover:bg-(--primary-color)`}>
											<PiXLogoLight className="text-2xl" />
										</div>
									</a>
								</div>
							</div>
						</div>
					</div>

					{/* Profile preview */}
					<div className={!editProfile? 'h-full col-span-12 lg:col-span-8': 'hidden'}>
						<div className="w-full flex flex-col rounded-3xl border border-(--secondary-text) p-4 sm:p-6">
							<nav className="w-full border-b border-(--secondary-text) mb-5">
								<ul className="w-full flex items-center overflow-x-scroll scrollbar-none">
									<li onClick={() => setProfileTab('overview')} className={`${profileTab.includes('overview')? 'text-(--primary-color) before:absolute before:top-full before:left-0 before:w-full before:border-b before:border-(--primary-color)': 'text-(--primary-text)'} relative pb-3 px-2 sm:px-3 font-Plus-Jakarta-Sans font-normal text-lg sm:text-xl capitalize cursor-pointer hover:text-(--primary-color)`}>
										overview
									</li>
									<li onClick={() => setProfileTab('bookings')} className={`${profileTab.includes('bookings')? 'text-(--primary-color) before:absolute before:top-full before:left-0 before:w-full before:border-b before:border-(--primary-color)': 'text-(--primary-text)'} relative pb-3 px-2 sm:px-3 font-Plus-Jakarta-Sans font-normal text-lg sm:text-xl capitalize cursor-pointer hover:text-(--primary-color)`}>
										bookings
									</li>
									<li onClick={() => setProfileTab('reviews')} className={`${profileTab.includes('reviews')? 'text-(--primary-color) before:absolute before:top-full before:left-0 before:w-full before:border-b before:border-(--primary-color)': 'text-(--primary-text)'} relative pb-3 px-2 sm:px-3 font-Plus-Jakarta-Sans font-normal text-lg sm:text-xl capitalize cursor-pointer hover:text-(--primary-color)`}>
										reviews
									</li>
								</ul>
							</nav>

							<div className={profileTab !== 'overview'? 'hidden': 'block'}>
								<div className="flex flex-col gap-3 mb-5">
									<h2 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">
										about me:
									</h2>
									{user.aboutMe ? 
										<pre className="w-full text-wrap font-Plus-Jakarta-Sans font-extralight text-lg tracking-wide text-(--secondary-text)">
											{user.aboutMe}
										</pre>
									:
										<div className="flex flex-col items-center py-4">
											<img src="/aboutMe.webp" alt="icon" className="w-38 sm:w-52"/>
											<h3 className="font-Plus-Jakarta-Sans font-medium text-(--secondary-text) text-base sm:text-lg capitalize">not data found</h3>
											<div onClick={() => { setEditProfile(true) }} className="flex items-center hover:border-b hover:border-(--primary-color) text-(--primary-color) cursor-pointer">
												<PiPlus className="text-xl"/>
												<span className="font-Plus-Jakarta-Sans font-normal text-sm sm:text-base capitalize">add about yourself</span>
											</div>
										</div>
									}
								</div>
								<div className="flex flex-col gap-3 mb-5">
									<h2 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">
										Certifications:
									</h2>
									{ user.certifications.length > 0 ?
										<ul className="flex flex-col gap-3 py-4">
											{
												user.certifications.map((certificate, index) => {
													return (
														<li key={index} className="flex items-start gap-3">
															<div className="min-w-14 h-14 rounded-full flex items-center justify-center text-2xl text-(--primary-text) bg-[rgb(81,194,6,0.15)]">
																<PiGraduationCap />
															</div>
															<div className="flex flex-col font-Plus-Jakarta-Sans">
																<h3 className="font-normal text-lg text-(--primary-text) capitalize">{ certificate.name }</h3>
																<h4 className="font-normal text-sm text-(--secondary-text) capitalize mb-2">{ certificate.department }</h4>
																<p className="font-light text-base text-(--secondary-text) lowercase first-letter:capitalize line-clamp-3">{ certificate.description }</p>
															</div>
														</li>
													)
												})
											}
										</ul>
									:
										<div className="flex flex-col items-center py-4">
											<img src="/certification.webp" alt="icon" className="w-38 sm:w-52"/>
											<h3 className="font-Plus-Jakarta-Sans font-medium text-(--secondary-text) text-base sm:text-lg capitalize">not data found</h3>
											<div onClick={() => { setEditProfile(true) }} className="flex items-center hover:border-b hover:border-(--primary-color) text-(--primary-color) cursor-pointer">
												<PiPlus className="text-xl"/>
												<span className="font-Plus-Jakarta-Sans font-normal text-sm sm:text-base capitalize">add certification</span>
											</div>
										</div>
									}
								</div>
								<div className="flex flex-col gap-3 mb-5">
									<h2 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">
										Language preference:
									</h2>
									<div className="flex items-center gap-2">
										{
										user.languages.length > 0?
											user.languages.map((lang, idx) => {
												return (
													<h4 className="py-1.5 px-3 sm:py-2 sm:px-5 bg-[rgb(144,144,144,0.25)] font-Plus-Jakarta-Sans fotnt-normal text-sm sm:text-base text-(--secondary-text) capitalize rounded-xl sm:rounded-2xl" key={idx}>
														{lang}
													</h4>
												)
											})
										:
											<div className="w-full flex flex-col items-center py-4">
												<img src="/languages.webp" alt="icon" className="w-38 sm:w-52"/>
												<h3 className="font-Plus-Jakarta-Sans font-medium text-(--secondary-text) text-base sm:text-lg capitalize">not data found</h3>
												<div onClick={() => { setEditProfile(true) }} className="flex items-center hover:border-b hover:border-(--primary-color) text-(--primary-color) cursor-pointer">
													<PiPlus className="text-xl"/>
													<span className="font-Plus-Jakarta-Sans font-normal text-sm sm:text-base capitalize">add language</span>
												</div>
											</div>
										}
									</div>
								</div>
							</div>

							<div className={`${profileTab !== 'bookings'? 'hidden': 'block'} h-full flex flex-col`}>
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-2">
										<h4 className="font-Plus-Jakarta-Sans font-normal text-lg text-(--primary-text) capitalize">bookings management</h4>
									</div>
									<button className="flex items-center gap-1 text-(--secondary-text) px-4 py-2 border border-(--secondary-text) duration-300 ease-in-out hover:text-(--primary-color) hover:border-(--primary-color) hover:scale-95 cursor-pointer rounded-2xl">
										<PiFunnel className="text-xl"/>
										<span className="font-Playfair font-light text-base capitalize">filter</span>
									</button>
								</div>
								<div className="h-full grid grid-cols-12 gap-4">
									{
										bookings.length > 0?
											bookings.map((booking, idx) => {
												return <BookingCard key={idx} booking={booking} onDelete={(bookingId) => setBookings(bookings.filter((i) => i._id !== bookingId))} />
											})
										:
											<div className="col-span-12 w-full h-[50vh] flex flex-col items-center justify-center">
												<span className="font-Plus-Jakarta-Sans font-normal text-lg text-(--secondary-text) capitalize">no bookings found</span>
											</div>
									}
								</div>
							</div>

							<div className={profileTab !== 'reviews'? 'hidden': 'block'}>
								<div className="col-span-12 w-full h-[50vh] flex flex-col items-center justify-center">
									<span className="font-Plus-Jakarta-Sans font-normal text-lg text-(--secondary-text) capitalize">no reviews found</span>
								</div>
							</div>
						</div>
					</div>
					
					{/* Edit Mode ( on ) */}
					<div className={editProfile? 'col-span-12 lg:col-span-8 rounded-3xl border border-(--secondary-text) p-4 sm:p-6': 'hidden'}>
						<h2 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize pb-2 border-b-1 border-(--grey-color) mb-5">profile editing</h2>
						<form encType="multipart/form-data" className="w-full flex flex-col gap-6">

							<section className="grid grid-cols-12 gap-4">
								<div className="col-span-12 w-full flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className="w-[3px] h-7 rounded-full bg-(--primary-color)"></span>
										<h3 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">personal information</h3>
									</div>
								</div>
								{
									Object.keys(personalInfo).map((field, idx) => {
										return ( idx !== 4 &&
											<div key={idx} className={`${[5,6].includes(idx)? 'col-span-12': 'col-span-12 sm:col-span-6'} flex flex-col items-start gap-1`}>
												<label htmlFor={field} className="inline-block font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize">{ field }</label>
												<input type="text" onChange={(event) => { setPersonalInfo({ ...personalInfo, [event.target.name]: event.target.value }) }} name={field} id={field} placeholder={'enter your ' + field} className={`${idx === 6? 'hidden': 'block'} font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-extralight placeholder:text-(--secondary-text) capitalize w-full h-12 border-b border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]`}/>
												<textarea type="text" onChange={(event) => { setPersonalInfo({ ...personalInfo, [event.target.name]: event.target.value }) }} name={field} id={field} placeholder={'enter your ' + field} className={`${idx === 6? 'block': 'hidden'} font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-extralight placeholder:text-(--secondary-text) capitalize w-full h-12 border-b border-(--secondary-text) py-3 px-4 focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]`}/>
											</div>
										) || (	idx === 4 &&
											<div key={idx} className="col-span-12 sm:col-span-6">
												<Dropdown
													items={['male', 'female']}
													classes={'w-full left-0'}
													onSelect={(value) => { setPersonalInfo({ ...personalInfo, gender: value }) }}
												>
													<div className={`flex flex-col items-start gap-1`}>
														<label htmlFor={field} className="inline-block font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize">{ field }</label>
														<div className={`${!personalInfo.gender? 'text-(--secondary-text)': 'text-(--primary-text)'} font-Plus-Jakarta-Sans font-light text-sm placeholder:font-normal capitalize w-full h-12 flex items-center border-b border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]`}>
															{ !personalInfo.gender? 'select your gender': personalInfo.gender }
														</div>
													</div>
												</Dropdown>
											</div>
										)
									})
								}
							</section>

							<section className="grid grid-cols-12 gap-4">
								<div className="col-span-12 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className="w-[3px] h-7 rounded-full bg-(--primary-color)"></span>
										<h3 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">certifications</h3>
									</div>
									<button onClick={addCertification} className="flex items-center gap-1 hover:border-b-1 hover:border-(--primary-color)">
										<PiPlus className="text-xl text-(--primary-color)"/>
										<span className="hidden sm:block font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-color) capitalize cursor-pointer">
											add certification
										</span>
									</button>
								</div>
								<ul className="col-span-12 w-ful flex flex-col gap-6">
									{
										certifications.length !== 0?
											certifications.map((certification, idx) => {
												return (
													<li key={idx} className="relative w-full grid grid-cols-12 gap-4">
														<div className={`col-span-6 flex flex-col items-start gap-1`}>
															<label htmlFor={'certificate' + idx} className="inline-block font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize">university's name</label>
															<input type="text" onChange={(event) => { changeCertification(event, idx) } } value={certification.name} name="name" id={'certificate-' + idx} placeholder={'enter university\'s name'} className={`font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-extralight placeholder:text-(--secondary-text) capitalize w-full h-12 border-b border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)] :border-2`}/>
														</div>
														<div className={`col-span-6 flex flex-col items-start gap-1`}>
															<label htmlFor={'certificate' + idx} className="inline-block font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize">university's department</label>
															<input type="text" onChange={(event) => { changeCertification(event, idx) }} value={certification.department} name="department" id={'certificate-' + idx} placeholder={'enter university\'s department'} className={`font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-extralight placeholder:text-(--secondary-text) capitalize w-full h-12 border-b border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]`}/>
														</div>
														<div className={`col-span-12 flex flex-col items-start gap-1`}>
															<label htmlFor={'certificate' + idx} className="inline-block font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize">description</label>
															<input type="text" onChange={(event) => { changeCertification(event, idx) }} value={certification.description}  name="description" id={'certificate-' + idx} placeholder={'enter your description'} className={`font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-extralight placeholder:text-(--secondary-text) capitalize w-full h-12 border-b border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]`}/>
														</div>
														<div onClick={(event) => { removeCertification(event, idx) }} className="w-6 h-6 flex items-center justify-center absolute top-0 right-0 text-base duration-300 ease-in-out text-[#DE350B] hover:text-(--primary-text) bg-[rgb(222,53,110,.2)] hover:bg-[#DE350B]  rounded-lg cursor-pointer">
															<PiXBold />
														</div>
													</li>
												)
											})
										:
										<div className="flex flex-col items-center py-4">
											<img src="/certification.webp" alt="icon" className="w-52 mb-2"/>
											<h3 className="font-Plus-Jakarta-Sans font-medium text-(--secondary-text) text-lg capitalize">not certifications found</h3>
											<div onClick={addCertification} className="flex items-center hover:border-b hover:border-(--primary-color) text-(--primary-color) cursor-pointer">
												<PiPlus className="text-xl"/>
												<span className="font-Plus-Jakarta-Sans font-normal text-base capitalize">add certification</span>
											</div>
										</div>
									}
								</ul>
							</section>

							<section className="grid grid-cols-12 gap-4">
								<div className="col-span-12 w-full flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className="w-[3px] h-7 rounded-full bg-(--primary-color)"></span>
										<h3 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">social links</h3>
									</div>
								</div>
								{
									Object.keys(socials).map((field, idx) => {
										return (
											<div key={idx} className={`col-span-12 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5`}>
												<label htmlFor={field} className="w-1/4 inline-block font-Plus-Jakarta-Sans font-normal text-lg text-(--primary-text) capitalize mb-2">{ field }:</label>
												<input type="text" onChange={(event) => { setSocials({ ...socials, [event.target.name]: event.target.value }) }} name={field} id={field} placeholder={'enter your ' + field + ' link'} className={`${idx === 6? 'hidden': 'block'} font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-extralight placeholder:text-(--secondary-text) capitalize w-full h-12 border-b border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]`}/>
											</div>
										)
									})
								}
							</section>

							<section>
								<div className="w-full flex items-center justify-between mb-4">
									<div className="flex items-center gap-2">
										<span className="w-[3px] h-7 rounded-full bg-(--primary-color)"></span>
										<h3 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">languages</h3>
									</div>
								</div>
								<Dropdown
									items={languages.filter((l) => l.toLowerCase().includes(languageSearch.toLowerCase()))}
									classes={'w-full overflow-y-auto'}
									onSelect={handleSelect}
								>
									<input type="text" onChange={(event) => { setLanguageSearch(event.target.value); }} name='language' id='language' placeholder='enter your language' autoComplete="off" className={`font-Plus-Jakarta-Sans font-light text-sm placeholder:text-sm text-(--primary-text) placeholder:font-extralight placeholder:text-(--secondary-text) capitalize w-full h-12 border-b border-(--secondary-text) px-4 duration-300 ease-in-out focus:outline-none focus:border-(--primary-color) focus:bg-[rgb(144,144,144,0.2)]`}/>
								</Dropdown>
								<ul className="w-full flex flex-wrap items-center gap-2 mt-3">
									{
										selectedLanguages.map((selectedLanguage, idx) => {
											return (
												<li key={idx} className="flex items-center gap-2 px-3 py-2 rounded-full font-Plus-Jakarta-Sans font-normal text-(--primary-text) border border-(--primary-color)">
													<span className="text-sm">{ selectedLanguage }</span>
													<PiX onClick={() => { setSelectedLanguages(selectedLanguages.filter((i) => i !== selectedLanguage)) }} className="text-base text-red-600 cursor-pointer"/>
												</li>
											)
										})
									}
								</ul>								
							</section>

							<div className="w-full flex justify-end">
								<button onClick={handleSubmit} type="submit" className={`${isLoading? '!bg-(--primary-color)/50 h-13': ''} mainBtn`}>
									<div className="w-full h-full flex items-center justify-center gap-3">
										<div className={`${isLoading? 'block': 'hidden'} relative h-4 w-4 animate-spin`}>
											<div className="absolute top-0 left-0 w-4 h-4 rounded-full border-2 border-(--primary-text) border-t-transparent"></div>
										</div>
										<span className={`${isLoading? 'hidden' : 'block'}`}>save updates</span>
									</div>
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
			<Footer />
		</main>
	);
}

export default Profile;
