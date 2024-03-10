import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import session from "express-session";
import {
  connectDB,
  createUser,
  login,
  insertData,
  getTransactions,
  getTransactionsSummary,
  deleteTransaction,
} from "./db.js";
import crypto from "crypto";

const app = express();

const secret = crypto.randomBytes(64).toString("hex"); //Secret Key for generating tokens

//Checking for Validness of string
const checkInvalidString = (str) => {
  const pattern = /^[a-zA-Z0-9@.# ]+$/;
  return pattern.test(str);
};

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
  })
);

let jsonParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({ extended: false });

//Function to response to post request to register a new user
app.post("/register", jsonParser, async (req, res) => {
  let data = req.body;
  let uid = data.uid;
  let pwd = data.password;
  let name = data.name;

  if (
    checkInvalidString(uid) &&
    checkInvalidString(pwd) &&
    checkInvalidString(name) &&
    uid.length<=50 && pwd.length<=20 && name.length<=100
  ) {
    createUser([uid, name, pwd], (err, result) => {
      if (err) {
        res.statusCode = 500;
        res.send("Creation Failed - Server Error: " + err.code);
      } else {
        res.statusCode = 200;
        res.send({"msg":"User Added Successfully"});
      }
    });
  } else {
    res.statusCode = 422;
    res.send("Data sent is invalid");
  }
});

//Logging in User to his account
app.post("/login", jsonParser, async (req, res) => {
  let data = req.body;
  let uid = data.uid;
  let pwd = data.password;

  //Checking if user already logged in
  if (!req.session.token) {
    //Limit false login attempts
    if (req.session.attempt && req.session.attempt == 5) {
      setTimeout(() => {
        req.session.attempt = null;
        req.session.save();
      }, 300000);
      req.session.attempt++;
      res.statusCode = 429;
      res.send("Too Many Request! Try Again after 5 minutes.");
    } else if (req.session.attempt && req.session.attempt > 5) {
      console.log(req.session.attempt);
      req.session.attempt++;
      res.statusCode = 429;
      res.send("Too Many Request! Try Again after 5 minutes.");
    } else {
      if (checkInvalidString(uid) && checkInvalidString(pwd) && uid.length<=50 && pwd.length<=20) {
        //checking login credentials
        login([uid, pwd], (err, result) => {
          if (err) {
            res.statusCode = 500;
            res.send("Creation Failed - Server Error: " + err.code);
          } else {
            //User provided false credentials
            if (result.length <= 0) {
              if (req.session.attempt) req.session.attempt++;
              else req.session.attempt = 1;
              res.statusCode = 401;
              res.send("Invalid Credentials!");
            }
            //Setting login session and returning token
            else {
              let token = jwt.sign(
                { uid: result[0].UID, name: result[0].NAME, loggedIn: true },
                secret
              );
              req.session.token = token;
              req.session.attempt = null;
              res.statusCode = 200;
              res.send({ token: token });
            }
          }
        });
      } else {
        res.statusCode = 422;
        res.send("Data sent is invalid");
      }
    }
  } else {
    res.statusCode = 200;
    res.send({"msg":"Already Logged In"});
  }
});

//Logging out user from his account
app.get("/logout", (req, res) => {
  let bHead = req.headers.authorization;
  if (bHead) {
    //Getting token from user to verify authority
    let user_token = bHead.split("Bearer ")[1];
    //Removing user token and session
    if (user_token === req.session.token) {
      req.session.attempt = null;
      req.session.token = null;
      req.session.save();
      res.statusCode = 200;
      res.send({"msg":"Logged Out"});
    } else {
      res.statusCode = 401;
      res.send("Invalid Token");
    }
  } else {
    res.statusCode = 401;
    res.send("Invalid Token");
  }
});

//Getting Transactions of a user in given time period
app.get("/transactions", async (req, res) => {
  //Getting Bearer Token from Headers
  let bHead = req.headers.authorization;

  if (bHead) {
    let user_token = bHead.split("Bearer ")[1];
    //Checking if user acessing his own transactions or not
    if (user_token === req.session.token) {
      let data = jwt.decode(user_token);
      if (data && data.loggedIn)
        await getTransactions(
          {
            uid: data.uid,
            fromDate: req.query.fromDate,
            toDate: req.query.toDate,
          },
          (err, result) => {
            if (err) {
              res.statusCode = 401;
              res.send("Unauthorized Access!");
            } else {
              res.statusCode = 200;
              if (result.length <= 0) res.send({"msg":"No Data Available"});
              else res.send(result);
            }
          }
        );
      else {
        res.statusCode = 401;
        res.send("Unauthorized Access!");
      }
    } else {
      res.statusCode = 401;
      res.send("Unauthorized Access!");
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized Access!");
  }
});

//Adding a new Transaction
app.post("/transactions", jsonParser, async (req, res) => {
  //Getting Bearer Token from Headers
  let bHead = req.headers.authorization;

  if (bHead) {
    let user_token = bHead.split("Bearer ")[1];

    let body = req.body; //Data to be inserted

    if (user_token === req.session.token) {
        
        //Fetching uid from token
        const uid = jwt.decode(user_token).uid;

      //Setting Transaction Date
      const date = new Date();
      const yyyy = date.getFullYear();
      let mm = date.getMonth() + 1;
      let dd = date.getDate();

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      //Adding Date
      body["date"] = `${yyyy}-${mm}-${dd}`;

      //Adding uid
      body["uid"] = uid;

      //inserting data
      await insertData(body, (err, result) => {
        if (err) {
          res.statusCode = 500;
          res.send("Data Insert Failed - Server Error!");
        } else {
          res.statusCode = 200;
          res.send({"msg":"Success - Data Inserted"});
        }
      });
    } else {
      res.statusCode = 401;
      res.send("Unauthorized Access!");
    }
  } else {
    res.statusCode = 401;
    res.send("Invalid Access!");
  }
});

//Getting Transactions Summary
app.get("/transactions/summary", async (req, res) => {
  //Getting Bearer Token from Headers
  let bHead = req.headers.authorization;

  if (bHead) {
    let user_token = bHead.split("Bearer ")[1];
    if (user_token === req.session.token) {
      let data = jwt.decode(user_token);
      if (data && data.loggedIn)
        await getTransactionsSummary({ uid: data.uid }, (err, result) => {
          if (err) {
            res.statusCode = 401;
            res.send("Unauthorized Access!");
          } else {
            res.statusCode = 200;
            res.send(result);
          }
        });
      else {
        res.statusCode = 401;
        res.send("Unauthorized Access!");
      }
    } else {
      res.statusCode = 401;
      res.send("Unauthorized Access!");
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized Access!");
  }
});

//Deleting a given transaction
app.delete("/transactions", async (req, res) => {
  //Getting Bearer Token from Headers
  let bHead = req.headers.authorization;

  if (bHead) {
    let user_token = bHead.split("Bearer ")[1];
    if (user_token === req.session.token) {
      let data = jwt.decode(user_token);
      if (data && data.loggedIn)
        await deleteTransaction(
          { uid: data.uid, id: req.query.id },
          (err, result) => {
            if (err) {
              res.statusCode = 401;
              res.send("Unauthorized Access!");
            } else {
              if (result.affectedRows <= 0) {
                res.statusCode = 404;
                res.send("Data not found");
              } else {
                res.statusCode = 200;
                res.send({"msg":"Successfully Deleted Entry"});
              }
            }
          }
        );
      else {
        res.statusCode = 401;
        res.send("Unauthorized Access!");
      }
    } else {
      res.statusCode = 401;
      res.send("Unauthorized Access!");
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized Access!");
  }
});

//Port for server to listen
const port = process.env.PORT || 3030;

//Setting up server
app.listen(port, () => {
  console.log("Server listening at " + port);
});

export const application = app;