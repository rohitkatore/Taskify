import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext() ;

export const UserProvider = ({children})=>{
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true) ;
    const [token,setToken] = useState(null);

    const url = "https://projectandtaskmanagement.onrender.com"

    useEffect(()=>{
        const token = localStorage.getItem('token') ;
        if(token){
            fetchUser(token);
        }else{
            setLoading(false) ;
        }
    },[]);

    const fetchUser = async(token)=>{
        try{
            const res = await axios.get(`${url}/api/auth/me`,{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            console.log(res.data) ;
            if(res.status == 200){
                setUser(res.data);
            }else{
                localStorage.removeItem('token') ;
            }
        }catch(err){
            console.log("faild to fetch user data :",err);
            localStorage.removeItem('token');
        }finally{
            setLoading(false) ;
        }
    }

    const Login = async (email,password)=>{
        const res = await axios.post(url+`/api/auth/login`,{email,password},{ withCredentials: true });
        localStorage.setItem('token',res.data.token) ;
        console.log(res.data)
        return res ;
    }

    const Logout = async()=>{
        localStorage.removeItem("token");
        setUser(null);
    }


    return (
        <UserContext.Provider value={{user,loading,Login,Logout,url}}>
            {children}
        </UserContext.Provider>
    )
};

export const useUser= () => useContext(UserContext);