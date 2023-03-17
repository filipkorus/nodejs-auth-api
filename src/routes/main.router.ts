import { Router } from 'express';
import userRouter from './user/user.router';
import {SUCCESS} from "../helpers/responses/messages";

const router = Router();

router.use('/user', userRouter);

router.get('/', (req, res) => SUCCESS(res, {apiVersion: 1.0}));

export default router;
