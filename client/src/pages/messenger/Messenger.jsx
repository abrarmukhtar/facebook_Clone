import "./messenger.css"
import { useContext, useState, useRef, useEffect } from 'react'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversations/Conversation'
import Message from "../../components/message/Message"
import ChatOnline from "../../components/chatOnline/ChatOnline"
import { AuthContext } from "../../components/context/AuthContext"
import axios from "axios"
import { io } from 'socket.io-client';


export default function Messenger() {


    const { user } = useContext(AuthContext);
    const socket = useRef(null);
    const [conversations, setConversations] = useState([])
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const scrolRef = useRef();
    const [test, settesting]=useState('')
 
    useEffect(() => {
        socket.current = io("ws://localhost:8900");
    
         socket.current.on("getMessage", (data) => {
          setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          });
        });
      }, []);

      
  //this code confusing
  useEffect(()=>{
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && 
    setMessages(prev => [...prev, arrivalMessage]);
  },[arrivalMessage, currentChat])
  
//end of confusing
    useEffect(
        () => {

           socket.current.emit("addUser", user._id);
    

           socket.current.on("getUsers", users=>{
                //  console.log(users)
                 setOnlineUsers(user.followings.filter(f=>users.some(u=>u.userId=== f)))
           })
        }

        , [user])


    //this get all conversations
    useEffect(() => {
        const getConversations = async () => {
          try {
            const res = await axios.get("/conversations/" + user._id);
            setConversations(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        getConversations();
      }, [user._id]);
    


    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get('/messages/' + currentChat?._id)
                setMessages(res.data)
            } catch (error) {
                console.log(error)
            }


        }
        getMessages();

    }, [currentChat])


    const handleSend = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id
        }

        
    const receiverId = currentChat.members.find(
        (member) => member !== user._id
      );


        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        })
         


        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages, res.data])
            setNewMessage('')
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        scrolRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])
    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">

                        <input placeholder="Search for friends" className="chatMenuInput" />
                        {conversations.length > 0 && (conversations.map((c) => {

                            return (
                                <div onClick={() => setCurrentChat(c)} key={c._id}>
                                    <Conversation conversation={c} currentUser={user} />
                                </div>
                            )

                        }))}
                    </div>
                </div>
                <div className="chatBox">

                    <div className="chatBoxWrapper">
                        {
                            currentChat ?
                                <>
                                    <div className="chatBoxTop">
                                        {
                                            messages.map((m) => {

                                                return (
                                                    <div ref={scrolRef} key={m._id}>
                                                        <Message message={m} own={m.sender === user._id} />
                                                    </div>
                                                )
                                            })
                                        }


                                    </div>
                                    <div className="chatBoxBottom">

                                        <textarea placeholder="write something......" onChange={e => setNewMessage(e.target.value)} value={newMessage} className="chatMessageInput"></textarea>
                                        <button className="chatSubmitButton" onClick={handleSend}>Send</button>
                                    </div>
                                </>
                                : <span className="noConversation"> Open a conversation to Start a Chat. </span>}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                         <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
                    </div>

                </div>
            </div>

        </>
    )
}
