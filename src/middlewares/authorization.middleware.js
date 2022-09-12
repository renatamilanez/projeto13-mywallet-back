import db from "../database/db.js";

async function hasAuthorization(req, res, next){
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token){
        return res.sendStatus(401);
    } 

    try {
        const session = await db.collection('sessions').findOne({
            token
        });
        const user = await db.collection('users').findOne({
            _id: session.userId
        });
    
        if (!session || !user){
            return res.sendStatus(401);
        } 

        res.locals.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export default hasAuthorization;