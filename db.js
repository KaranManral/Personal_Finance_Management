import mysql from "mysql"; //MySQL package

//Creating database connection
const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "Karan@2002",
    database: "finance_management",
    timezone: "utc"
});

//Connecting to Database
export const connectDB = async ()=>{    
    connection.connect((err)=>{
        if(err)
            throw err;
        console.log("CONNECTED!");
    });
}

//Adding User to Database
export const createUser = async(data,callback)=>{
    if(connection.state === 'disconnected')
        try{
            await connectDB();    
        }
        catch(err){
            console.log("ERROR CONNECTING DATABASE:\n\n");
            return callback(err,"");
        }
    let sql = "INSERT INTO USERS(UID,NAME,PASSWORD) VALUES(?,?,?)";
    connection.query(sql,data,(err,result)=>{
        if(err)
            return callback(err,"");
        return callback(null,result);
    });
}

//Logging User into their Account
export const login = async(data,callback)=>{
    if(connection.state === 'disconnected')
        try{
            await connectDB();    
        }
        catch(err){
            console.log("ERROR CONNECTING DATABASE:\n\n");
            return callback(err,"");
        }
    let sql = "SELECT * FROM USERS WHERE UID=? AND PASSWORD=?";
    connection.query(sql,data,(err,result)=>{
        if(err)
            return callback(err,"");
        return callback(null,result);
    });
}

//Inserting Transaction data into database
export const insertData = async (data,callback)=>{
    if(connection.state === 'disconnected')
        try{
            await connectDB();    
        }
        catch(err){
            console.log("ERROR CONNECTING DATABASE:\n\n");
            return callback(err,"");
        }
    let sql = "INSERT INTO TRANSACTIONS(TTYPE,AMOUNT,TDATE,UID) VALUES(?,?,?,?)";
    await connection.query(sql,[data.type,data.amount,data.date,data.uid],(err,result)=>{
        if(err)
            return callback(err,"");
        return callback(null,result);
    });
}

//Fetching Transactions during a given period
export const getTransactions = async ({uid,fromDate,toDate},callback)=>{
    if(connection.state === 'disconnected')
        try{
            await connectDB();    
        }
        catch(err){
            console.log("ERROR CONNECTING DATABASE:\n\n");
            return callback(err,"");
        }
    let sql = "SELECT TID,TDATE,TTYPE,AMOUNT FROM TRANSACTIONS WHERE UID=? AND TDATE BETWEEN ? AND ?";
    connection.query(sql,[uid,fromDate,toDate],(err,result)=>{
        if(err)
            return callback(err,"");
        return callback(null,result);
    });
}

//Fetching Transaction Summary
export const getTransactionsSummary = async ({uid},callback)=>{
    if(connection.state === 'disconnected')
        try{
            await connectDB();    
        }
        catch(err){
            console.log("ERROR CONNECTING DATABASE:\n\n");
            return callback(err,"");
        }
    let sql = "SELECT TTYPE,AMOUNT FROM TRANSACTIONS WHERE UID=?";
    connection.query(sql,[uid],(err,result)=>{
        if(err)
            return callback(err,"");
        const data = {total_income:0,total_expense:0,total_savings:0};
        if(result.length<=0)
            return callback(null,data);
        else{
            //Calculating Total income, expense and savings of a user
            result.map((x,i)=>{
                if(x.TTYPE==="income"){
                    data.total_income+=x.AMOUNT;
                }
                else{
                    data.total_expense+=x.AMOUNT;
                }
            });
            data.total_savings = data.total_income - data.total_expense;
            return callback(null,data);
        }
    });
}

//Deleting a given Transaction from databse
export const deleteTransaction = async ({uid,id},callback)=>{
    if(connection.state === 'disconnected')
        try{
            await connectDB();    
        }
        catch(err){
            console.log("ERROR CONNECTING DATABASE:\n\n");
            return callback(err,"");
        }
    let sql = "DELETE FROM TRANSACTIONS WHERE TID=? AND UID=?";
    connection.query(sql,[id,uid],(err,result)=>{
        if(err)
            return callback(err,"");
        return callback(null,result);
    });
}