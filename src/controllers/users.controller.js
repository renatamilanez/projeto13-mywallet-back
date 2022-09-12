import db from "../database/db.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { stripHtml } from 'string-strip-html';
import joi from 'joi';

const userSchema = joi.object({
    name: joi.string().required().min(3),
    email: joi.string().email({ minDomainSegments: 2, tlds: {allow: ['com', 'net']}}),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeatPassword: joi.ref('password')
});

async function userSignUp(req, res) {
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
}

async function userSignIn(req, res) {
    const {email, password} = req.body;

    if(!email || !password){
        return res.sendStatus(400);
    }

    try {
        const user = await db.collection('users').findOne({email});
        const username = user.name;

        if(!user){
            return res.sendStatus(401);
        }

        const isValid = bcrypt.compareSync(password, user.password);

        if(!isValid){
            return res.sendStatus(401);
        }
        
        const token = uuidv4();
        const lastStatus = Date.now();

        db.collection('sessions').insertOne({
            email,
            token,
            lastStatus,
            userId: user._id
        });

        return res.send({
            username,
            email,
            token
        });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export {userSignUp, userSignIn};