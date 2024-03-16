import React,{useEffect} from "react";

export default function Logout(){
    useEffect(()=>{
        let token = localStorage.getItem("token");
        if(token){
            if(token.length>0){
                token="Bearer "+ token;
                new Promise((resolve,reject)=>{
                    resolve(fetch("/api/logout",{headers:{"Authorization":token}}));
                }).then(async (res)=>{
                    const data = await res.json();
                    alert(data.msg);
                    window.location.href="/";
                });
            }
            else window.location.href="/";
        }
        else window.location.href="/";
    
    },[]);
    return <></>;
}