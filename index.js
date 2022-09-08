import express from 'express';
import cors from 'cors';
import joi from 'joi';
import dayjs from 'dayjs';
import { MongoClient, ObjectId } from 'mongodb';
import { stripHtml } from 'string-strip-html';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const server = express();
server.use(cors());
server.use(express.json());

dayjs().format();

const mongoClient = new MongoClient ('mongodb://localhost:27017');
let db;
mongoClient.connect().then(() => {
    db = mongoClient.db('myWallet');
});

const userSchema = joi.object({
    name: joi.string().required().min(3),
    email: joi.string().email({ minDomainSegments: 2, tlds: {allow: ['com', 'net']}}),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeat_password: joi.ref('password')
});

//LOGIN
server.post('/sign-in', async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if(!token){
        res.sendStatus(401);
    }

    try {
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

server.post('/sign-up', async (req, res) => {
    const userData = req.body;
    const validation = userSchema.validate(userData, {abortEarly: false});

    if(validation.error){
        const errors = validation.error.details.map(detail => detail.message);
        return res.sendStatus(400).send(errors);
    } 

    const name = stripHtml(userData.name).result.trim();
    const email = userData.email;
    const hashPassword = bcrypt.hashSync(userData.password, 10);

    try { 
        const duplicate = await db.collection('users').findOne({email});

        if(duplicate){
            return res.sendStatus(409);
        };

        const user = await db.collection('users').insertOne({
            name,
            email,
            password: hashPassword
        });
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.send(500);
    }
}); 

server.get('/records', async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token){
        return res.sendStatus(401);
    }

    try {
        const session = await db.collection('sessions').findOne({
            token
        });

        if(!session){
            return res.sendStatus(401);
        }

        const user = await db.collection('users').findOne({
            _id: session.userId
        });

        const records = await db.collection('records').find({
            userId: user._id
        }).toArray();

        return res.send(records);

    } catch (error) { 
        console.error(error);
        return res.sendStatus(500);
    }

    return res.send(200);
});

server.post('/records', async (req, res) => {

});

server.listen(3000, ()=> {
    console.log('Listening on Port 3000');
});