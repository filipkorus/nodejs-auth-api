import express from 'express';
import {Auth, Register, Login, Logout, Refresh, getUser} from './controller/auth.controller';
import {canViewPost, getPostById} from "./controller/post.controller";
import {changeRole} from "./controller/admin.controller";

const auth = express.Router()
   .post('/register', Register)
   .post('/login', Login)
   .post('/logout', Logout)
   .post('/refresh', Refresh)
   .get('/user', Auth, getUser);

const posts = express.Router()
   .get('/:id', canViewPost, getPostById);

const admin = express.Router()
   .patch('/role', changeRole);

export default {auth, posts, admin};
