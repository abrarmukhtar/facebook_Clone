const io = require("socket.io")(8900, {
    //this is confing 
    cors: {
      origin: "http://localhost:3000",
    },
  });
let users=[];

const addUser=(userId, socketId)=>{
    !users.some(user=>user.userId === userId) && users.push({userId, socketId})
}
const removeUser = (socketid)=>{
    users = users.filter(user => user.socketId !== socketid)
}


const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

  io.on('connection', (socket) => {
      //when connect
    console.log('a user connected');
    
    //take userid and socket id from user
    socket.on("addUser",userId=>{
            addUser(userId, socket.id)
        //sent online users to client
            io.emit("getUsers", users)
    })

    //send and get message

    socket.on("sendMessage", ({senderId, receiverId, text})=>{
    
      const user = getUser(receiverId);
      
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      })
      
    })
  

    //when disconnected
    socket.on("disconnect",()=>{
        console.log("a user disconnected")
        removeUser(socket.id)
        io.emit("getUsers", users)

    })
  });

  