import express from 'express';
import {Auth, Login, Logout, Refresh, Register} from './controller/auth.controller';
import {getUser} from "./controller/api.controller";

const api = express.Router()
   .post('/register', Register)
   .post('/login', Login)
   .post('/logout', Logout)
   .post('/refresh', Refresh)
   .get('/user', Auth, getUser);

export default {api};
