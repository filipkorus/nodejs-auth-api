import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {createConnection} from 'typeorm';
import routes from './routes'
import {Auth, Role} from "./controller/auth.controller";
import ROLE from "./helper/roles";

createConnection().then(() => {
   const app = express();

   app.use(express.json());
   app.use(cookieParser());
   app.use(cors({
      origin: ['http://localhost', 'http://localhost:8080'],
      credentials: true
   }));

   app.use('/api/auth', routes.auth);
   app.use('/api/posts', Auth, routes.posts); // make only authenticated (logged) user can access this route by adding Auth middleware
   app.use('/api/admin', Auth, Role(ROLE.ADMIN), routes.admin); // define which roles can access this route by adding Role()

   app.listen(process.env.APP_PORT || 5000, () => console.log(`Server listening on port ${process.env.APP_PORT || 5000}`));
});
