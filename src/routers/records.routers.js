import express from 'express';
import {getRecords, createRecord} from "../controllers/records.controller.js";
import hasAuthorization from '../middlewares/authorization.middleware.js';

const router = express.Router();

router.use(hasAuthorization);
router.get('/records', getRecords);
router.post('/records', createRecord);

export default router;