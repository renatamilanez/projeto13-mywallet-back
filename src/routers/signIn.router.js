import express from 'express';
import {userSignIn} from "../controllers/users.controller.js";

const router = express.Router();

router.post('/sign-in', userSignIn);

export default router;