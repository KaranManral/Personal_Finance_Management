import React,{useState,useEffect} from "react";
import { checkValidString } from "./App";

export default function Register(){

    const [email,setEmail] = useState("");
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [cpassword,setCPassword] = useState("");

    useEffect(()=>{
        // console.log(email,password);
    });

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(name.length<=100&&email.length<=50&&password.length<=20&&checkValidString(name)&&checkValidString(email)&&checkValidString(password)){
            if(cpassword!=password){
                alert("Passwords don't match");
                return;
            }
            let temp_email = email.split("@");
            if(temp_email.length>2||temp_email[0].length<1)
            {
                alert("Invalid Email Address");
                return;
            }
            new Promise((resolve,reject)=>{
                resolve(fetch("/api/register",{method:"post",body:JSON.stringify({"uid":email,"password":password,"name":name}),headers:{"Content-Type":"application/json"}}));
            }).then(async (res)=>{
                const data = await res.json();
                alert(data.msg);
                if(res.status===200)
                    window.location.href = "/login";
            });
        }
        else alert("Invalid Name,Email or Password (should be less than 100,50,20 letters respectively and should not cotain special characters other than @,.,#)");
    }
    
    return(
    <form action="/api/register" method="post" className="container py-5 h-5/6 max-h-svh lg:w-2/5 md:w-2/3 sm:w-3/4 max-sm:w-11/12 flex flex-col justify-around items-center justify-self-center self-center border-2 border-gray-300 rounded-md" onSubmit={handleSubmit.bind(this)}>
        <h1 className="w-full p-5 text-center bg-orange-400 font-semibold text-gray-50 lg:text-5xl md:text-4xl sm:text-3xl max-sm:text-2xl">Register</h1>
        <input type="text" className="w-11/12 border rounded-sm p-3" name="Name" id="name" placeholder="Full Name" required onChange={(e)=>{setName(e.target.value)}} />
        <input type="email" className="w-11/12 border rounded-sm p-3" name="Email" id="email" placeholder="someone@example.com" required onChange={(e)=>{setEmail(e.target.value)}} />
        <input type="password" className="w-11/12 border rounded-sm p-3" name="Password" id="pwd" placeholder="Password" required onChange={(e)=>{setPassword(e.target.value)}} />
        <input type="password" className="w-11/12 border rounded-sm p-3" name="CPassword" id="cpwd" placeholder="Confirm Password" required onChange={(e)=>{setCPassword(e.target.value)}} />
        <input type="submit" className="bg-green-500 hover:bg-green-600 text-xl text-gray-50 rounded-md p-2 cursor-pointer" value="Register" />
    </form>);
}