import {expect} from "chai";
import request from "supertest";
import { application} from "../server/index.js"; 
import mysql from "mysql";

describe('App Test', () => {
    //Creating SQL connection to rollback changes made during test
    const connection = mysql.createConnection({
        host: "sql3.freemysqlhosting.net",
    port: "3306",
    user: "sql3691996",
    password: "IHHbGU2jCX",
    database: "sql3691996",
    timezone: "utc",
    });

    //Test Case to add user to database
    describe('POST /api/register', () => {
        it('should respond with status 200 and JSON',async () => {
            const data = {
                "uid":"abc@gmail.com",
                "password":"abc@123",
                "name": "ABC xyz"
            };
            const response = await request(application).post('/api/register').send(data).set('Accept','application/json');
            await connection.connect(async (err)=>{
                if(err)
                    throw err;
                console.log("CONNECTED!");
            });
            await connection.query("DELETE FROM USERS WHERE UID=?",["abc@gmail.com"],(err,result)=>{
                // console.log(err,result);
                // await connection.end();
            });
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('msg').that.includes('User Added Successfully');
        });
    });

    //Test Case to test login 
    describe('POST /api/login', () => {
        it('should return with status 200 and token as JSON',async () => {
            const data = {
                "uid":"karan@gmail.com",
                "password":"Karan@2002"
            };
            const response = await request(application).post('/api/login').send(data);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('token');
        });
    });

    //Test Case to get all transactions of user in given time period
    describe('GET /transactions', () => {
        it('should return with satus 200 and data as json',async () => {
            const data = {
                "uid":"karan@gmail.com",
                "password":"Karan@2002"
            };
            const agent = request.agent(application); // Use agent to maintain session state
            let req = await agent.post('/api/login').send(data);//getting user token for test

            const response = await agent.get('/transactions?fromDate=2002-05-01&toDate=2026-06-29').set('Authorization',`Bearer ${req.body.token}`);
            expect(response.status).to.equal(200);
        });
    });
    
    //Test Case to add a transaction for a user
    describe('POST /transactions', () => {
        it('should return with satus 200 and data inserted successfully',async () => {
            const data1 = {
                "uid":"karan@gmail.com",
                "password":"Karan@2002"
            };
            const data2 = {
                "type":"income",
                "amount":630000
            };
            const agent = request.agent(application); // Use agent to maintain session state
            let req = await agent.post('/api/login').send(data1);//getting user token for test

            const response = await agent.post('/transactions').send(data2).set('Authorization',`Bearer ${req.body.token}`);

            await connection.connect(async (err)=>{
                if(err)
                    throw err;
                console.log("CONNECTED!");
            });

            await connection.query("DELETE FROM TRANSACTIONS WHERE UID=? ORDER BY TID DESC LIMIT 1",["karan@gmail.com"],(err,result)=>{
                console.log(result.affectedRows);
                // connection.end();
            });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('msg').that.includes('Success - Data Inserted');
        });
    });

    //Test Case to get transactions summary of a user
    describe('GET /transactions/summary', () => {
        it('should return with satus 200 and data as json',async () => {
            const data = {
                "uid":"karan@gmail.com",
                "password":"Karan@2002"
            };
            const agent = request.agent(application); // Use agent to maintain session state
            let req = await agent.post('/api/login').send(data);//getting user token for test

            const response = await agent.get('/transactions/summary').set('Authorization',`Bearer ${req.body.token}`);
            expect(response.status).to.equal(200);
        });
    });

    //Test Case to delete a transaction
    describe('Delete /transactions?id', () => {
        it('should return with satus 200 and data deleted successfully',async () => {
            const data = {
                "uid":"karan@gmail.com",
                "password":"Karan@2002"
            };
            const agent = request.agent(application); // Use agent to maintain session state
            let req = await agent.post('/api/login').send(data); //getting user token for test

            const response = await agent.delete('/transactions?id=11').set('Authorization',`Bearer ${req.body.token}`);

            await connection.connect(async (err)=>{
                if(err)
                    throw err;
                console.log("CONNECTED!");
            });

            await connection.query("INSERT INTO TRANSACTIONS VALUES(11,'income',530000,'2024-03-10','karan@gmail.com')",["karan@gmail.com"],(err,result)=>{
                console.log(result.affectedRows);
                // connection.end();
            });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('msg').that.includes('Successfully Deleted Entry');
        });
    });
});
