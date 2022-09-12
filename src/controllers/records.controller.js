import joi from 'joi';
import db from "../database/db.js";
import { stripHtml } from 'string-strip-html';
import dayjs from 'dayjs';

dayjs().format();
let now = dayjs();

const recordSchema = joi.object({
    description: joi.string().required(),
    value: joi.number().positive().precision(2).required(),
    type: joi.valid('positive', 'negative')
});

async function getRecords(req, res){
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

        if(!user){
            return res.sendStatus(401);
        }

        const records = await db.collection('records').find({
            userId: user._id
        }).toArray();

        return res.send(records);

    } catch (error) { 
        console.error(error);
        return res.sendStatus(500);
    }
}

async function createRecord(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const data = req.body;

    if (!token){
        return res.sendStatus(401);
    }

    const validation = recordSchema.validate(data, {abortEarly: false});

    if(validation.error){
        const errors = validation.error.details.map(detail => detail.message);
        return res.sendStatus(400).send(errors);
    }

    const value = (data.value);
    const description = stripHtml(data.description).result.trim();
    const type = data.type;
    const date = now.format("DD/MM");

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

        if(!user){
            return res.sendStatus(401);
        }

        const record = await db.collection('records').insertOne({
            userId: user._id,
            value,
            description,
            type,
            date
        });

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export {getRecords, createRecord};