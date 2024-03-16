import React,{useEffect,useState} from "react";
import { jwtDecode } from "jwt-decode";
import { checkValidString } from "./App";

export default function Login(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    useEffect(()=>{
        //do something
    });

    useEffect(()=>{
        let ls = localStorage;
        let token = ls.getItem("token");
        if(token){
            let ob = jwtDecode(token);
            if(ob.loggedIn){
                window.location.href = "/";
            }
            else return;
        }
        else return;
    },[]);

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(email.length<=50&&password.length<=20&&checkValidString(email)&&checkValidString(password)){
            new Promise((resolve,reject)=>{
                resolve(fetch("/api/login",{method:"post",body:JSON.stringify({"uid":email,"password":password}),headers:{"Content-Type":"application/json"}}));
            }).then(async (res)=>{
                const data = await res.json();
                if(data.token){
                    let ls = localStorage;
                    ls.setItem("token",data.token);
                    window.location.href = "/";
                }
                else alert(data.msg);
            });
        }
        else alert("Invalid Email or Password");
    }

    return(
    <form action="/api/login" method="post" className="container py-2 h-2/3 max-h-svh lg:w-2/5 md:w-2/3 sm:w-3/4 max-sm:w-11/12 flex flex-col justify-around items-center justify-self-center self-center border-2 border-gray-300 rounded-md" onSubmit={handleSubmit.bind(this)}>
        <h1 className="w-full p-5 text-center bg-orange-400 font-semibold text-gray-50 lg:text-5xl md:text-4xl sm:text-3xl max-sm:text-2xl">Login</h1>
        <input type="email" className="w-11/12 border rounded-sm p-4" name="Email" id="email" placeholder="someone@example.com" required onChange={(e)=>{setEmail(e.target.value)}} />
        <input type="password" className="w-11/12 border rounded-sm p-4" name="Password" id="pwd" placeholder="........" required onChange={(e)=>{setPassword(e.target.value)}} />
        <input type="submit" className="bg-green-500 hover:bg-green-600 text-xl text-gray-50 rounded-md p-2 cursor-pointer" value="Login" />
    </form>);
}