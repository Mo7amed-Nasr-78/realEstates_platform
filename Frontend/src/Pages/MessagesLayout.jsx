import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatList from "../components/ChatList";
import Chat from "../components/Chat";
import { useProps } from "../components/PropsProvider";

function MessagesLayout() {

    const { socket, connectionStatus } = useProps();
    const [ status, setStatus ] = useState(null);
    const [ newMsg, setNewMsg ] = useState(null);
    const [ deletedMsg, setDeletedNewMsg ] = useState(null);
    const [ readMsg, setReadMsg ] = useState(null);
    const [ unreadMsgs, setUnreadMsgs ] = useState(null);
    const [ newChat, setNewChat ] = useState(null);

    useEffect(() => {
        if (!socket || !connectionStatus) return;

        socket.on('userStatus', (data) => {
            setStatus(data);
        });

        socket.on("newMessage", (message) => {
            setNewMsg(message);
        })

        socket.on('deleteMessage', (deletedMsg) => {
            setDeletedNewMsg(deletedMsg);
        })

        socket.on('newChat', (newChat) => {
            setNewChat(newChat);
        })

        socket.on('readMessage', (readMsg) => {
            setReadMsg(readMsg);
        })

        socket.on('markUnreadMessages', (unreadMessages) => {
            setUnreadMsgs(unreadMessages)
        })

        return () => {
            socket.off('userStatus');
            socket.off('newMessage');
            socket.off('deleteMessage');
            socket.off('readMessage');
            socket.off('newChat');
            socket.off('markUnreadMessages');
        }

    }, [ socket, connectionStatus ]);

    return (
        <main>
            <Header />
            <section className="w-full bg-(--bg-color) mt-26 lg:mt-36 mb-25">
                <div className="grid grid-cols-12 container mx-auto gap-6">
                    <div className="col-span-12 flex flex-col gap-1">
                        <h2 className="font-Playfair font-medium text-4xl text-(--primary-text) capitalize">messages</h2>
                        <h4 className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">Stay Connected with Seamless Communication</h4>
                    </div>
                    <ChatList status={status} newMsg={newMsg} newChat={newChat} readMsg={readMsg}/>
                    <Chat status={status} newMsg={newMsg} deletedMsg={deletedMsg} readMsg={readMsg} unreadMsgs={unreadMsgs}/>
                </div>
            </section>
            <Footer />
        </main>
    )
}

export default MessagesLayout;