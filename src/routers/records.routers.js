import express from 'express';
import {getRecords, createRecord, deleteRecord} from "../controllers/records.controller.js";
import hasAuthorization from '../middlewares/authorization.middleware.js';

const router = express.Router();

router.delete('/delete/:id', deleteRecord);
router.use(hasAuthorization);
router.get('/records', getRecords);
router.post('/records', createRecord);

export default router;