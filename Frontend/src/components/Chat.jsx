import { useCallback, useEffect, useRef, useState } from "react";
import { useProps } from "./PropsContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
    PiVideoCamera,
    PiSmileyLight,
    PiPaperclipLight,
    PiPaperPlaneTilt,
    PiTrash
} from 'react-icons/pi'
import EmojiPicker from 'emoji-picker-react';

function Chat({ status, newMsg }) {

    const { id } = useParams();
    const { url, user } = useProps();

    // Component useState
    const [ msg, setMsg ] = useState('')
    const [ msgs, setMsgs ] = useState([])
    const [ otherUser, setOtherUser ] = useState(null);
    const [ showPicker, setShowPicker ] = useState(false);

    // Component useRefs
    const msgsRef = useRef(null);
    const sendBtnRef = useRef(null);

    useEffect(() => {
        if (!id) return;

        const getChatMsgs = async () => {
            try {
                const res = (await axios.get(
                    `${url}/api/chat/conversations/${id}`,
                    {
                        withCredentials: true,
                    }
                )).data;
                setOtherUser(res.otherUser);
                setMsgs(res.messages);
            } catch (err) {
                console.log(err);
            }
        }
        getChatMsgs();

    }, [id])

    useEffect(() => {
    
        const msgsWindow = msgsRef.current;
        if (msgsWindow) {
            msgsWindow.scrollTo({
                behavior: 'smooth',
                top: msgsWindow.scrollHeight
            });
        }

    }, [msgs])

    useEffect(() => {
        if (status) {
            setOtherUser((prevs) => {
                return { ...prevs, isActive: status.status === 'offline'? false : true }
            })
        }
    }, [status]);

    useEffect(() => {
        if (newMsg) {
            setMsgs((prevs) => {
                return [ ...prevs, newMsg ];
            });
        }
    }, [newMsg]);
    
    const sendMessage = useCallback(async () => {
        if (!msg) return;
        sendBtnRef.current.style.disabled = true;
        try {
            const res = (await axios.post(
                `${url}/api/chat/message/${otherUser._id}`,
                { 
                    content: msg 
                },
                {
                    withCredentials: true,
                }
            )).data;
            setMsgs((prev) => [ ...prev, res.message ]);
        } catch (err) {
            console.log(err);
        } finally {
            setMsg('');
            sendBtnRef.current.style.disabled = true;
        }
    }, [msg]);


    const handleEmoji = useCallback((event) => {
        setMsg((i) => i + event.emoji);
    }, []);

    const handleDeleteMsg = useCallback(async (msgId) => {
        try {
            const res = (await axios.delete(
                `${url}/api/chat/message/${msgId}`,
                {
                    withCredentials: true
                }
            )).data;
            setMsgs(msgs.filter((msg) => msg._id !== res.deletedMessage._id));
        } catch (err) {
            console.log(err);
        }
    })


    return (
        <div className={'col-span-12 lg:col-span-8 h-[90vh] lg:h-[80vh] flex flex-col justify-between gap-6 rounded-3xl border border-(--secondary-text) p-4 sm:p-6'}>
            {
                id?
                    <div className="h-full flex flex-col gap-2">
                        <div className="w-full flex items-center justify-between p-3 rounded-3xl bg-(--secondary-color)">
                            <div className="flex items-center justify-between gap-3">
                                <img src={otherUser?.picture} alt="image" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-(--primary-color)" />
                                <div className="flex flex-col">
                                    <h3 className="font-Plus-Jakarta-Sans font-medium text-xl text-(--primary-text) capitalize line-clamp-1">{ otherUser?.name }</h3>
                                    <h5 className="font-Plus-Jakarta-Sans font-light text-sm text-(--secondary-text) capitalize">
                                        { 
                                            otherUser?.isActive? 
                                                'active now'
                                            : 
                                                new Date(otherUser?.lastSeen).toLocaleTimeString('en', {
                                                    weekday: 'long',
                                                    timeZone: "Africa/Cairo"
                                                })
                                        }
                                    </h5>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border-1 border-(--primary-color) duration-300 ease-in-out hover:scale-95 cursor-pointer">
                                    <PiVideoCamera className="text-xl sm:text-2xl text-(--primary-color)"/>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border-1 border-(--primary-color) duration-300 ease-in-out hover:scale-95 cursor-pointer">
                                    <div className="flex items-center gap-0.5">
                                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-(--primary-color)"></span>
                                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-(--primary-color)"></span>
                                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-(--primary-color)"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div ref={msgsRef} className="w-full h-full flex flex-col justify-start gap-3 py-3 overflow-y-scroll scrollbar-none">
                            {
                                msgs.length > 0?
                                    msgs.map((msg, idx) => {
                                        return (
                                            <div key={idx} className={`${user._id !== msg.receiver? 'flex-row-reverse': ''} flex items-end gap-2`}>
                                                <img src={user._id === msg.receiver? otherUser.picture: user.picture} alt="image" className="w-6 h-6 rounded-full border border-(--primary-color)"/>
                                                <div className={`w-1/2 flex justify-end break-words`}>
                                                    <div className={`${user._id !== msg.receiver? 'rounded-br-none ms-auto': 'rounded-bl-none me-auto'} group relative max-w-full py-3 px-4 rounded-2xl bg-(--secondary-color)`}>
                                                        <span className="font-Plus-Jakarta-Sans font-normal text-base text-(--primary-text)">{ msg.content }</span>
                                                        <div onClick={() => handleDeleteMsg(msg._id)} className={`${msg.sender === user._id? 'group-hover:flex items-center justify-center': ''} hidden absolute right-full top-1/2 -translate-y-1/2 w-8 h-8 rounded-full cursor-pointer hover:bg-[#DE350B]/10`}>
                                                            <PiTrash className="text-lg text-[#DE350B]" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                :
                                    null
                            }
                        </div>
                        <div className="relative w-full flex items-center justify-between p-3 rounded-3xl bg-(--secondary-color) gap-4">
                            <div className="absolute bottom-full left-0">
                                { showPicker? <EmojiPicker onEmojiClick={handleEmoji} searchDisabled={true} skinTonesDisabled={true} height={350} width={'w-full'} emojiStyle="facebook" /> : null }
                            </div>
                            <div className="w-full flex items-center gap-2">
                                <div className="flex items-center justify-between gap-1">
                                    <PiSmileyLight onClick={() => setShowPicker(!showPicker)} className="text-3xl text-(--primary-color) cursor-pointer duration-300 ease-in-out hover:scale-95" />
                                    {/* <PiPaperclipLight className="text-2xl text-(--primary-color) cursor-pointer duration-300 ease-in-out -rotate-45 hover:scale-95"/> */}
                                </div>
                                <input onChange={(event) => setMsg(event.target.value)} value={msg} type="" placeholder="type a mesage..." autoComplete="off" className="w-full font-Plus-Jakarta-Sans font-normal text-base text-(--primary-text) placeholder:text-base sm:placeholder:text-lg placeholder:text-(--secondary-text) placeholder:font-light focus:outline-none placeholder:capitalize" />
                            </div>
                            <div ref={sendBtnRef} onClick={sendMessage} className="min-w-10 min-h-10 sm:min-w-12 sm:min-h-12 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-xl sm:text-2xl text-(--black-color) bg-(--primary-color) cursor-pointer duration-300 ease-in-out hover:scale-90 hover:text-(--primary-text)">
                                <PiPaperPlaneTilt />
                            </div>
                        </div>
                    </div>
                :
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <img src="/message.webp" alt="illustration" className="w-62"/>
                        <span className="font-Plus-Jakarta-Sans font-normal text-lg text-(--secondary-text) capitalize">no messages found</span>
                    </div>
            }
        </div>
    )
}

export default Chat;