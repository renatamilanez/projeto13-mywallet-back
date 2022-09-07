import express from 'express';
import cors from 'cors';
import joi from 'joi';
import dayjs from 'dayjs';
import { MongoClient, ObjectId } from 'mongodb';
import { stripHtml } from 'string-strip-html';

const server = express();
server.use(cors());
server.use(express.json());

const mongoClient = new MongoClient ('mongodb://localhost:27017');
let db;
mongoClient.connect().then(() => {
    db = mongoClient.db('myWallet');
});

dayjs().format();

server.listen(3000, ()=> {
    console.log('Listening on Port 3000');
})