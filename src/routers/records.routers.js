import express from 'express';
import {getRecords, createRecord} from "./controllers/records.controller.js";

const router = express.Router();

router.get('/records', getRecords);
router.post('/records', createRecord);

export default router;