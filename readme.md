# Personal Finance Manager API Documentation

## Overview

The Personal Finance Manager API provides endpoints for managing personal finance data.

## Base URL

http://localhost:3030


## Endpoints

### POST /register

Description: Add new user.

#### Request

- Method: POST
- Path: /register
- Body: User data object

Example Request Body:
```json
{
    "uid":"koran29@gmail.com",
    "password":"Karan@29",
    "name": "Karan Singh Manral"
}
```

#### Response

- Status Code: 200 OK
- Body: {msg:"User Added Successfully"}

### POST /login

Description: Login user into his/her account.

#### Request

- Method: POST
- Path: /login
- Body: User data object

Example Request Body:
```json
{
    "uid":"koran29@gmail.com",
    "password":"Karan@29"
}
```

#### Response

- Status Code: 200 OK
- Body: {token:'Bearer token'}

### GET /logout

Description: Logout user from his/her account.

#### Request

- Method: GET
- Path: /logout
- Header: {Authorization:'Bearer token'}

#### Response

- Status Code: 200 OK
- Body: {msg:"Logged Out"}

### GET /transactions

Description: Retrieve all transactions in given time period.

#### Request

- Method: GET
- Path: /transactions
- Parameters: fromDate,toDate
- Header: {Authorization:'Bearer token'}

Example Request URL: http://localhost:3030/transactions?fromDate=2002-05-01&toDate=2026-06-29

#### Response

- Status Code: 200 OK
- Body: List of transaction objects.

Example Response Body:

```json
[
  {
    "tid": 1,
    "ttype": "income",
    "amount": 1500,
    "tdate": "2024-03-01",
    "uid": "karan@gmail.com"
  },
  {
    "tid": 2,
    "ttype": "expense",
    "amount": 300,
    "tdate": "2024-03-10",
    "uid": "karan@gmail.com"
  }
]
```

### POST /transactions

Description: Add a new transaction.

#### Request

- Method: POST
- Path: /transactions
- Body: Transaction object
- Header: {Authorization:'Bearer token'}

Example Request Body:
```json
{
    "type": "income",
    "amount": 64000
}
```

#### Response

- Status Code: 200 OK
- Body: {msg:"Success - Data Inserted"}

### DELETE /transactions/:id

Description: Delete a transaction by ID.

#### Request

-Method: DELETE
-Path: /transactions/:id
-Parameters: Transaction ID
- Header: {Authorization:'Bearer token'}

Example Request URL: http://localhost:3030/transactions?id=11

#### Response

- Status Code: 200 OK
- Body: {msg:"Successfully Deleted Entry"}

### GET /transactions/summary

Description: Retrieve all transactions summary.

#### Request

- Method: GET
- Path: /transactions
- Parameters: None
- Header: {Authorization:'Bearer token'}

#### Response

- Status Code: 200 OK
- Body: Details of total transactions.

Example Response Body:

```json
[
  {
    "total_income": 10000,
    "total_expense": 5000,
    "total_savings": 5000,
  }
]
```

## Error Handling

- 400 Bad Request: Invalid request body or parameters.
- 401 UNAUTHORIZED: Unauthorized Access.
- 404 Not Found: Resource not found.
- 422 Unprocessable Entity: Invalid Data.
- 429 Too Many Requests: Too Many Requests.
- 500 Internal Server Error: Unexpected server error.

## Testing

Testing for the Personal Finance Manager API can be done using the provided test scripts.

### Running Tests

```bash
npx mocha test/test.js
```

## Running the Application

To run the Personal Finance Manager API, follow these steps:

1. Install dependencies by running:

```bash
npm install
```

2. Start the application by running:

```bash
npm start
```

This will start the Express.js server, and your API will be accessible at the specified base URL.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.