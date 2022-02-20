import {Request, Response, NextFunction} from 'express';
import {compare, hash} from 'bcryptjs';
import {sign, verify} from 'jsonwebtoken';
import {getRepository, MoreThanOrEqual} from 'typeorm';
import {User} from '../entity/user.entity';
import {Token} from '../entity/token.entity';
import ROLE from "../helper/roles";

export const Register = async (req: Request, res: Response) => {
   const {username, email, password} = req.body;

   if (!(username && email && password)) {
      return res.status(400).json({
         success: false,
         message: 'Invalid credentials'
      });
   }

   const user = await getRepository(User).save({
      username,
      email,
      password: await hash(password, 12),
      role: ROLE.USER
   });

   const {password: string, ...data} = user;
   res.json({
      success: true,
      message: 'user created successfully',
      user: data
   });
};

export const Login = async (req: Request, res: Response) => {
   const {username, password} = req.body;

   if (!(username && password)) {
      return res.status(400).json({
         success: false,
         message: 'Invalid credentials'
      });
   }

   const user = await getRepository(User).findOne({
      username
   });

   if (!user) {
      return res.status(400).json({
         success: false,
         message: 'Invalid credentials'
      });
   }

   if (!await compare(password, user.password)) {
      return res.status(400).json({
         success: false,
         message: 'Invalid credentials'
      });
   }

   const refreshToken = sign({
      id: user.id
   }, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

   res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days,
      sameSite: 'strict'
   });

   const expired_at = new Date();
   expired_at.setDate(expired_at.getDate() + 7);

   await getRepository(Token).save({
      user_id: user.id,
      token: refreshToken,
      expired_at
   });

   const token = sign({
      id: user.id
   }, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });

   res.json({
      success: true,
      message: 'user logged successfully',
      token
   });
};

export const Refresh = async (req: Request, res: Response) => {
   try {
      const refreshToken = req.cookies['refreshToken'];

      const payload: any = verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`);
      if (!payload) {
         return res.status(401).json({
            success: false,
            message: 'Unauthorized'
         });
      }

      const dbToken = await getRepository(Token).findOne({
         user_id: payload.id,
         expired_at: MoreThanOrEqual(new Date())
      });

      if (!dbToken) {
         return res.status(401).json({
            success: false,
            message: 'Unauthorized'
         });
      }

      const token = sign({
         id: payload.id
      }, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });

      res.json({
         success: true,
         message: 'access token has been refreshed',
         token
      });
   } catch (e) {
      return res.status(401).json({
         success: false,
         message: 'Unauthorized'
      });
   }
};

export const Logout = async (req: Request, res: Response) => {
   const refreshToken = req.cookies['refreshToken'];

   await getRepository(Token).delete({ token: refreshToken });

   res.cookie('refreshToken', '', { maxAge:0 });

   res.json({
      success: true,
      message: 'logout successfully'
   });
};

export const Auth = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const accessToken = req.header('Authorization')?.split(' ')[1] || '';
      const payload: any = verify(accessToken, `${process.env.ACCESS_TOKEN_SECRET}`);
      if (!payload) {
         return res.status(401).json({
            success: false,
            message: 'Unauthorized'
         });
      }

      const user = await getRepository(User).findOne({ id: payload.id });

      if (!user) {
         return res.status(401).json({
            success: false,
            message: 'Unauthorized'
         });
      }

      const {password, ...data} = user;
      // @ts-ignore
      req.user = data;
      next();
   } catch (e) {
      res.status(401).json({
         success: false,
         message: 'Unauthorized'
      });
   }
};

export const Role = (...roles: string[]) => {
   return async (req: Request, res: Response, next: NextFunction) => {
      // @ts-ignore
      if (!roles.includes(req.user.role)) {
         return res.status(403).json({
            success: false,
            message: 'Forbidden'
         });
      }
      next();
   }
};

export const getUser = async (req: Request, res: Response) => {
   res.json({
      success: true,
      message: '',
      // @ts-ignore
      user: req.user
   });
};
