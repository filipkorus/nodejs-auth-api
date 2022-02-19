import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {createConnection} from 'typeorm';
import routes from './routes'

createConnection().then(() => {
   const app = express();

   app.use(express.json());
   app.use(cookieParser());
   app.use(cors({
      origin: ['http://localhost', 'http://localhost:8080'],
      credentials: true
   }));

   app.use('/api', routes.api);

   app.listen(process.env.APP_PORT || 5000, () => console.log(`Server listening on port ${process.env.APP_PORT || 5000}`));
});
