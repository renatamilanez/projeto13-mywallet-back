import express from 'express';
import cors from 'cors';
import {userSignIn, userSignUp} from "./controllers/users.controller.js";
import {getRecords, createRecord} from "./controllers/records.controller.js";

const server = express();
server.use(cors()); 
server.use(express.json());

server.post('/sign-in', userSignIn);
server.post('/sign-up', userSignUp); 
server.get('/records', getRecords);
server.post('/records', createRecord);

server.listen(4000, ()=> {
    console.log('Listening on Port 4000');
});