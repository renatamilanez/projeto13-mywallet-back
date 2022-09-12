import express from 'express';
import cors from 'cors';
import signInRouter from "./routers/signIn.router.js";
import signUpRouter from "./routers/signUp.router.js";
import recordsRouters from "./routers/records.routers.js";  

const server = express();
server.use(cors()); 
server.use(express.json());

server.use(signInRouter, signUpRouter, recordsRouters);

server.listen(4000, ()=> {
    console.log('Listening on Port 4000');
}); 