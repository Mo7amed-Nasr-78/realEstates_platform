import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProps } from "../components/PropsContext";
import Header from "../components/Header/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import axios from "axios";
import {
	PiGraduationCap,
	PiFacebookLogoLight,
	PiInstagramLogoLight,
	PiXLogoLight,
	PiInfoLight,
} from 'react-icons/pi';


function ProfileDetails() {

    const { id } = useParams();
    const { url } = useProps();
	const navigate = useNavigate();
    const [ user, setUser ] = useState(null);
	const [ profileTab, setProfileTab ] = useState('overview');


    useEffect(() => {
		if (!profileTab) return;

        const getProfileDetails = async () => {
            try {
                const res = (await axios.get(
                    `${url}/api/users/profile/${id}`,
                )).data;
                setUser(res.profile);
            } catch (err) {
                console.log(err)
            }
        }
        if (profileTab.includes('overview')) getProfileDetails();

    }, [profileTab])

	const createNewChat = useCallback(async (otherUserId) =>{
		try {
			const res = (await axios.get(
				`${url}/api/chat/create/${otherUserId}`,
				{
					withCredentials: true
				}
			)).data;
			navigate(`/messages/${res.chat._id}`)
		} catch (err) {
			console.log(err);
		}
	}, [id])

    if (!user) return <Loader />

    return (
		<main>
			<Header />
			<section className="w-full bg-(--bg-color) mt-36 mb-25">
				<div className="grid grid-cols-12 container mx-auto gap-6">

					<div className="col-span-12 lg:col-span-4">
						<div className="w-full flex flex-col items-center rounded-3xl border-2 border-(--secondary-text) p-4 sm:p-6">
							<div className="relative flex flex-col items-center mb-4">
								<img
									src={user.picture}
									alt="image"
									className="relative w-56 h-56 rounded-full border-2 border-(--primary-color) object-cover object-center before:content-['mohamed'] before:absolute before:w-20 before:h-20 before:bottom-0 before:right-0 before:rounded-full before:bg-red-500 before:z-50"
								/>
								<div className={`${user.isActive? 'block': 'hidden'} absolute bottom-2 right-1/4 translate-x-1/2 w-5 h-5 rounded-full bg-(--primary-color) border-4 border-(--bg-color) z-10`} title="active now"></div>
							</div>
							<h2 className="font-Plus-Jakarta-Sans font-medium text-3xl text-(--primary-text) capitalize text-center mb-1">
								{user.name}
							</h2>
							<h3 className="font-Plus-Jakarta-Sans font-normal text-lg text-(--secondary-text) capitalize text-center mb-4">
								{user.jobTitle}
							</h3>
							<button
								onClick={() => { createNewChat(user._id) }}
								className="w-full h-13 font-Playfair font-bold capitalize text-lg leading-0 text-(--black-color) bg-(--primary-color) rounded-[20px] border-2 border-(--primary-color) duration-300 ease-in-out hover:scale-95 hover:text-(--primary-color) hover:bg-transparent cursor-pointer"
							>
								message
							</button>
							<ul className="w-full my-5">
								<h4 className="font-Plus-Jakarta-Sans font-normal text-2xl text-(--primary-text) capitalize mb-5">
									contact details
								</h4>
								<li className="flex flex-col gap-1 mb-3">
									<h4 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">
										email
									</h4>
									<h6 className="font-Plus-Jakarta-Sans font-light text-xl text-(--secondary-text) overflow-x-scroll scrollbar-none">
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
									<h4 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">
										phone
									</h4>
									<h6 className="font-Plus-Jakarta-Sans font-light text-xl text-(--secondary-text) overflow-x-scroll scrollbar-none">
										{user.phone}
									</h6>
								</li>
							</ul>
							<div className="w-full">
								<h4 className="font-Plus-Jakarta-Sans font-normal text-2xl text-(--primary-text) capitalize mb-5">
									social links
								</h4>
								<div className="flex items-center gap-2">
									<a
										href={user.socialMediaHandles.facebook || null}
										target="_blank"
									>
										<div className={`${user.socialMediaHandles.facebook? 'text-(--primary-color) border-(--primary-color)': 'text-(--primary-text) border-(--primary-text) hover:border-(--primary-color)'} w-12 h-12 flex items-center justify-center rounded-full border-1 duration-300 ease-in-out hover:scale-95 hover:text-(--bg-text) hover:bg-(--primary-color) cursor-pointer`}>
											<PiFacebookLogoLight className="text-2xl" />
										</div>
									</a>
									<a href={user.socialMediaHandles.instagram || null} target="_blank">
										<div className={`${user.socialMediaHandles.instagram? 'text-(--primary-color) border-(--primary-color)': 'text-(--primary-text) border-(--primary-text) hover:border-(--primary-color)'} w-12 h-12 flex items-center justify-center rounded-full border-1 duration-300 ease-in-out hover:scale-95 hover:text-(--bg-text) hover:bg-(--primary-color) cursor-pointer`}>
											<PiInstagramLogoLight className="text-2xl" />
										</div>
									</a>
									<a href={user.socialMediaHandles.twitterX || null} target="_blank">
										<div className={`${user.socialMediaHandles.twitterX? 'text-(--primary-color) border-(--primary-color)': 'text-(--primary-text) border-(--primary-text) hover:border-(--primary-color)'} w-12 h-12 flex items-center justify-center rounded-full border-1 duration-300 ease-in-out hover:scale-95 hover:text-(--bg-text) hover:bg-(--primary-color) cursor-pointer`}>
											<PiXLogoLight className="text-2xl" />
										</div>
									</a>
								</div>
							</div>
						</div>
					</div>

					<div className='col-span-12 lg:col-span-8'>
						<div className="w-full rounded-3xl border-2 border-(--secondary-text) p-4 sm:p-6">
							<nav className="w-full border-b border-(--secondary-text) mb-5">
								<ul className="flex items-center">
									<li onClick={() => setProfileTab('overview')} className={`${profileTab.includes('overview')? 'text-(--primary-color) before:absolute before:top-full before:left-0 before:w-full before:border-b before:border-(--primary-color)': 'text-(--primary-text)'} relative pb-3 px-3 font-Plus-Jakarta-Sans font-normal text-xl capitalize cursor-pointer hover:text-(--primary-color)`}>
										overview
									</li>
									<li onClick={() => setProfileTab('reviews')} className={`${profileTab.includes('reviews')? 'text-(--primary-color) before:absolute before:top-full before:left-0 before:w-full before:border-b before:border-(--primary-color)': 'text-(--primary-text)'} relative pb-3 px-3 font-Plus-Jakarta-Sans font-normal text-xl capitalize cursor-pointer hover:text-(--primary-color)`}>
										reviews
									</li>
								</ul>
							</nav>
							<div className="flex flex-col gap-3 mb-5">
								<h2 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize">
									about me:
								</h2>
								{user.aboutMe ? 
									<pre className="font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) text-wrap">
										{user.aboutMe}
									</pre>
								:
									<div className="w-full flex flex-col items-center justify-center gap-1">
										<PiInfoLight className="text-4xl text-(--secondary-text)"/>
										<h3 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">no data found</h3>
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
									<div className="w-full flex flex-col items-center justify-center gap-1">
										<PiInfoLight className="text-4xl text-(--secondary-text)"/>
										<h3 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">no data found</h3>
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
												<h4 className="py-2 px-5 bg-[rgb(144,144,144,0.25)] font-Plus-Jakarta-Sans fotnt-normal text-base text-(--secondary-text) capitalize rounded-2xl" key={idx}>
													{lang}
												</h4>
											)
										})
									:
										<div className="w-full flex flex-col items-center justify-center gap-1">
											<PiInfoLight className="text-4xl text-(--secondary-text)"/>
											<h3 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">no data found</h3>
										</div>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</main>
	)
}

export default ProfileDetails;