import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer";
import ChatList from "../components/ChatList";
import Chat from "../components/Chat";
import { useProps } from "../components/PropsContext";

function MessagesLayout() {

    const { socket, connectionStatus } = useProps();
    const [ status, setStatus ] = useState(null);
    const [ newMsg, setNewMsg ] = useState(null);

    useEffect(() => {
        if (!socket || !connectionStatus) return;

        socket.on('userStatus', (data) => {
            setStatus(data);
        });

        socket.on("newMessage", (message) => {
            setNewMsg(message);
        })

        return () => {
            socket.off('userStatus');
            socket.off('newMessage');
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
                    <ChatList status={status} newMsg={newMsg}/>
                    <Chat status={status} newMsg={newMsg}/>
                </div>
            </section>
            <Footer />
        </main>
    )
}

export default MessagesLayout;