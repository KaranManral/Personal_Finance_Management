import React,{useEffect,useState} from "react";
import Display from "./Display";
import {jwtDecode} from "jwt-decode";

export default function Show(){
    const [prop,setProp] = useState([]);
    const [fromDate,setFromDate] = useState("1969-01-01");
    const [toDate,setToDate] = useState("2099-12-31");
    const [summary,setSummary] = useState({total_income:0,total_expense:0,total_savings:0});
    const [userDetails,setUserDetails] = useState({});

    const fetchData = () =>{
        let token = localStorage.getItem("token");
      if (token) {
        if (token.length > 0) {
          let ob = jwtDecode(token);
          if (ob.loggedIn) {
            token = "Bearer "+token;
            setUserDetails(ob);
            new Promise((resolve, reject) => {
              resolve(fetch(`/transactions?fromDate=${fromDate}&toDate=${toDate}`,{headers:{"Authorization":token}}));
            }).then(async (res) => {
                const data = await res.json();
                if(Array.isArray(data))
                    setProp(data);
                else setProp([]);
            });
            new Promise((resolve,reject)=>{
                resolve(fetch("/transactions/summary",{headers:{"Authorization":token}}));
            }).then(async (res) => {
                const data = await res.json();
                setSummary(data);
            });
          } else window.location.href = "/login";
        }
        else window.location.href = "/login";
      } else window.location.href = "/login";
    }

    useEffect(()=>{
        //do something
        // console.log(prop)
    });
    
    useEffect(() => {
      fetchData();
    }, []);

    function deleteTask(e){
        e.stopPropagation();
        let id = e.target.id;
        let token = localStorage.getItem("token");
        if (token) {
            if (token.length > 0) {
                token = "Bearer "+token;
                new Promise((resolve,reject)=>{
                    resolve(fetch(`/transactions?id=${id}`,{method:"delete",headers:{"Authorization":token}}));
                }).then(async (res)=>{
                    const data = await res.json();
                    alert(data.msg);
                    fetchData();
                });
            }
        }   
    }

    function getSummary(){
        if (summary.msg) alert(summary.msg);
        else {
          document.getElementById("display_title").innerText = "Transactions Summary";
          document.getElementById("disp_desc").innerHTML = 
          `
            <br />
            <div class="flex flex-row justify-evenly items-center"><p style="width:10px;height:10px;background-color:#E38627"></p><p>Total Income= ${summary.total_income}</p></div>
            <div class="flex flex-row justify-evenly items-center"><p style="width:10px;height:10px;background-color:#C13C37"></p><p>Total Expense= ${summary.total_expense}</p></div>
            <div class="flex flex-row justify-evenly items-center"><p style="width:10px;height:10px;background-color:#6A2135"></p><p>Total Savings= ${summary.total_savings}</p></div>
            `;
          document.getElementById("default-modal").style.display = "grid";
        }  
    }

    return(
        <main>
            <Display income={summary.total_income} expense={summary.total_expense} savings={summary.total_savings}/>
            <div className="topbar mt-4 flex flex-col items-center justify-evenly" >
            <div className="date my-2 w-full flex justify-evenly items-center">
            From: <input type="date" className="border-2 p-2 rounded-sm" name="fromdate" id="fromdate" onChange={(e)=>{setFromDate(e.target.value);fetchData();}} />
            To: <input type="date" className="border-2 p-2 rounded-sm" name="todate" id="todate" onChange={(e)=>{setToDate(e.target.value);fetchData()}} />
            </div>
            <br />
            <button type="button" className="p-3 rounded-md bg-blue-500 hover:bg-blue-600 cursor-pointer text-gray-50" onClick={(e)=>getSummary()}>Summary</button>
            </div>
            <table className="container mx-auto my-12 text-center">
                <thead>
                <tr className="bg-green-600 text-white ">
                    <th>Transaction ID</th>
                    <th>Transaction Type</th>
                    <th>Amount</th>
                    <th>Transaction Date</th>
                    <th>Modify</th>
                </tr>
                </thead>
                <tbody>
                {prop.length===0?<tr><th>NO TRANSACTIONS YET</th></tr>:prop.map((x,i)=>{
                    return ( 
                        <tr key={i} id={i} className={i%2==0?"bg-gray-300":""}>
                            <td>{x.TID}</td>
                            <td>{x.TTYPE}</td>
                            <td>{x.AMOUNT}</td>
                            <td>{(x.TDATE).split("T")[0]}</td>
                            <td className="flex justify-around"><button type="button" id={x.TID} className="bg-red-600 hover:bg-red-500 text-white py-2 px-3 rounded-md" onClick={deleteTask.bind(this)}>Delete</button></td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </main>
    );
}