import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import {
    PiMagnifyingGlass,
    PiSliders
} from 'react-icons/pi';

function ChatList({ status, newMsg, newChat }) {

    const { id } = useParams();
    const [ conversations, setConversations ] = useState([]);
    const [ search, setSearch ] = useState('');


    useEffect(() => {
            
        const getConversations = async () => {
            try {
                const { data: { conversations } } = await api.get(
                    `/api/chat/conversations`,
                    {
                        params: {
                            name: search,
                            order: 'latest'
                        }
                    }
                );
                setConversations(conversations);
            } catch (err) {
                console.log(err);
            }
        }
        getConversations();
    
    }, [search, id])

    useEffect(() => {
        if (status) {
            setConversations((prevs) => {
                return prevs.map((conversation) => {
                    if (conversation.otherUser._id === status.userId) {
                        return { ...conversation, otherUser: {  ...conversation.otherUser, isActive: status.status === 'offline'? false : true } }
                    } else {
                        return conversation;
                    }
                })
            })
        }
    }, [status])

    useEffect(() => {
        if (newMsg) {
            setConversations((prevs) => {
                return prevs.map((conversation) => {
                    if (conversation._id === newMsg.chat._id) {
                        return { ...conversation, lastMessage: newMsg }
                    } else {
                        return conversation;
                    }
                })
            })
        }
    }, [newMsg])

    useEffect(() => {
        if (newChat) {
            setConversations((prevs) => {
                if (prevs.some((chat) => chat._id === newChat._id)) {
                    return [ ...prevs ];
                } 
                return [ ...prevs, newChat ];
            })
        }
    }, [newChat])

    return (
        <div className="col-span-12 lg:col-span-4 xl:h-[80vh]">
            <div className="w-full h-full flex flex-col items-center rounded-3xl border-1 border-(--secondary-text) p-4 sm:p-6">
                <div className="w-full flex items-center gap-2 pb-3 border-b border-(--secondary-text) mb-6">
                    <div className="w-full h-14 flex items-center gap-2 bg-(--secondary-color) rounded-3xl px-4">
                        <PiMagnifyingGlass className="text-2xl text-(--primary-color)"/>
                        <input type="search" onChange={(event) => { setSearch(event.target.value) }}  placeholder="search..." autoComplete="off" className="w-full font-Plus-Jakarta-Sans font-normal text-base text-(--primary-text) placeholder:text-lg placeholder:text-(--secondary-text) placeholder:capitalize focus:outline-none"/>
                    </div>
                    <div className="min-w-14 h-14 flex items-center justify-center rounded-full bg-(--secondary-color) duration-300 ease-in-out hover:scale-95 cursor-pointer">
                        <PiSliders className="text-2xl text-(--primary-color)"/>
                    </div>
                </div>
                <ul className="w-full h-full flex lg:flex-col gap-2 overflow-x-scroll lg:overflow-y-scroll scrollbar-none">
                    {
                        conversations.length > 0?
                            conversations.map((conversation, idx) => {
                                return (
                                    <Link key={idx} to={`/messages/${conversation._id}`} className={`${conversation._id === id? 'order-first': ''}`}>
                                        <li className={`${conversation._id === id? 'lg:bg-(--secondary-color) order-1': 'lg:bg-[rgb(252,254,255,0.1)]'} w-fit lg:w-full lg:flex lg:items-center lg:gap-2 lg:p-3 lg:hover:bg-(--secondary-color) rounded-3xl cursor-pointer duration-300 ease-in-out hover:scale-[98%]`} title={conversation.name}>
                                            <div className="relative">
                                                <img src={ conversation.otherUser.picture } alt="image" className="min-w-16 min-h-16 w-16 h-16 rounded-full object-cover border-2 border-(--primary-color)"/>
                                                <span className={`${conversation.otherUser.isActive? 'block': 'hidden'} absolute w-3 h-3 bottom-0 right-1/6 rounded-full bg-(--primary-color) border-2 border-(--secondary-color)`}></span>
                                            </div>
                                            <div className="w-full hidden lg:flex flex-col overflow-hidden">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3 className="font-Plus-Jakarta-Sans font-medium text-lg text-(--primary-text) capitalize mb-0 line-clamp-1">{ conversation.otherUser.name }</h3>
                                                    <span className={`${conversation.otherUser.isActive? 'hidden': 'block'} font-Plus-Jakarta-Sans font-medium text-xs text-(--primary-text) text-nowrap`}>
                                                        { new Date(conversation.lastMessage.createdAt).toLocaleTimeString("en", {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            timeZone: "Africa/Cairo",
                                                        }) }
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-4">
                                                    <h5 className="w-full font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) line-clamp-1">{ conversation.lastMessage.content }</h5>
                                                </div>
                                            </div>
                                        </li>
                                    </Link>
                                )
                            })
                        :
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                <span className="font-Plus-Jakarta-Sans font-normal text-lg text-(--secondary-text) capitalize">no conversations found</span>
                            </div>
                    }
                </ul>
            </div>
        </div>
    )
}

export default ChatList;