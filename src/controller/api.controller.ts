import {Request, Response} from 'express';

export const getUser = async (req: Request, res: Response) => {
   res.json({
      success: true,
      message: '',
      // @ts-ignore
      user: req.user
   });
};
