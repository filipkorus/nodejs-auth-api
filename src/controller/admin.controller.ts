import {Request, Response} from 'express';
import {getRepository} from "typeorm";
import {User} from "../entity/user.entity";
import ROLE from "../helper/roles";

export const changeRole = async (req: Request, res: Response) => {
   const {id, role} = req.body;

   if (!(id && role)) {
      return res.status(406).json({
         success: false,
         message: 'Too few arguments'
      });
   }

   if (Object.values(ROLE).indexOf(role) === -1) { // if passed role exists
      return res.status(406).json({
         success: false,
         message: 'Given role does not exists'
      });
   }

   await getRepository(User).update({ id },{ role });

   res.json({
      success: true,
      message: 'user\'s role updated successfully'
   });
};
