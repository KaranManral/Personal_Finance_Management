import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function Add() {
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("income");
  const [date, setDate] = useState("");
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    //do something
    // console.log(amount, type, date);
  });

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      if (token.length > 0) {
        let ob = jwtDecode(token);
        if (ob.loggedIn) {
          setUserDetails(ob);
        } else window.location.href = "/login";
      } else window.location.href = "/login";
    } else window.location.href = "/login";
  }, []);

  function formSubmit(e) {
    e.preventDefault();
    if (amount === 0) alert("Add some amount");
    else {
      let obj = {
        type: type,
        amount: amount,
        date: date,
      };
      let token = localStorage.getItem("token");
      if (token) {
        if (token.length > 0) {
          token = "Bearer " + token;
          new Promise((resolve, reject) => {
            resolve(
              fetch("/transactions", {
                method: "post",
                body: JSON.stringify(obj),
                headers: {
                  Authorization: token,
                  "Content-Type": "application/json",
                },
              })
            );
          }).then(async (res) => {
            const data = await res.json();
            alert(data.msg);
          });
        }
      }
    }
  }

  return (
    <main>
      <form
        action="/transactions"
        id="add_form"
        method="post"
        className="max-w-lg mx-auto my-12 border border-gray-500"
        onSubmit={formSubmit.bind(this)}
      >
        <h1 className="p-6 bg-gray-500 font-light text-6xl text-white text-center mb-12">
          Add Transaction
        </h1>
        <div className="content p-12">
          <label htmlFor="amount">Amount: </label>
          <input
            type="number"
            maxLength={9}
            min={0}
            max={999999999}
            defaultValue={0}
            name="amount"
            id="amount"
            className="ml-16 border-2 align-middle p-2"
            required
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
          <br />
          <br />

          <div className="flex justify-start">
            <label htmlFor="ttype">Txn. Type: </label>
            <div className="ml-16 w-3/4 flex items-center justify-evenly">
              <div className="w-1/2 flex justify-around">
                <label htmlFor="ttype1">Income:</label>
                <input
                  type="radio"
                  name="ttype"
                  id="ttype1"
                  value={"income"}
                  defaultChecked
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                />
              </div>
              <div className="w-1/2 flex justify-around">
                <label htmlFor="ttype2">Expense: </label>
                <input
                  type="radio"
                  name="ttype"
                  id="ttype2"
                  value={"expense"}
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          <br />
          <br />
          <label htmlFor="tdate">Txn. Date: </label>
          <input
            type="date"
            name="tdate"
            id="tdate"
            className="ml-20 p-2 cursor-pointer border-2"
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
          <br />
          <br />
          <div className="buttons flex flex-row justify-around align-middle">
            <button
              type="submit"
              className="py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-500"
            >
              Add
            </button>
            <button
              type="reset"
              className="py-2 px-6 border rounded-md hover:bg-gray-100"
              onClick={(e) => {
                setAmount(0);
                setType("income");
                setDate("");
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
