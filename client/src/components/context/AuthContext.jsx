import { createContext, useReducer } from "react"
import AuthReducer from "./AuthReducer";
import { useEffect } from "react";
// const INITIAL_STATE = {
//     user:
//     {
//         _id: "618809bfbc2b8ff5746010cf",
//         city: "Sarogdha",
//         coverPicture: "",
//         createdAt: "2021-11-07T17:15:43.808Z",
//         desc: "Hey! i am Jone",
//         email: "jone1@gmail.com",
//         followers: [],
//         followings: ["6188074861e05ddc7b25e441"],
//         from: "Pakistan",
//         isAdmin: false,
//         profilePicture: "person/1.jpeg",
//         relationship: 2,
//         updatedAt: "2021-11-16T15:06:10.788Z",
//         username: "Jone"
//     }
//     ,
//     isFetching: false,
//     error: false
// }

const INITIAL_STATE = {
    user:JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false,
  };

export const AuthContext = createContext(INITIAL_STATE);


export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    
    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(state.user))
      },[state.user])

    return (
        <AuthContext.Provider value={{
            user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            dispatch,
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}
