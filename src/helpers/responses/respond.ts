import {Response} from 'express';

const respond = (res: Response, message: string, status: number, data: object = {}) => res.status(status).json({
	success: status >= 200 && status <= 299,
	msg: message,
	...data
}).send();

export default respond;
