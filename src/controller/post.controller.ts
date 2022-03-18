import {NextFunction, Request, Response} from 'express';
import {getRepository} from 'typeorm';
import {Post} from "../entity/post.entity";

export const getPostById = async (req: Request, res: Response) => {
   const post = await getRepository(Post).findOne({
      id: +req.params.id
   });

   if (!post) {
      return res.status(404).json({
         success: false,
         message: 'Post not found'
      });
   }

   res.json({
      success: true,
      message: '',
      post
   });
};

export const canViewPost = async (req: Request, res: Response, next: NextFunction) => {
   const post = await getRepository(Post).findOne({
      id: +req.params.id
   });

   if (!post) {
      return res.status(404).json({
         success: false,
         message: 'Post not found'
      });
   }

   if ((req as any).user.id === post.user_id) { // user can view post only when it's created by oneself
      return next();
   }

   return res.status(403).json({
      success: false,
      message: 'Forbidden'
   });
};
