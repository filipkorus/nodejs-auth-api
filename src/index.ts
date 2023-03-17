import server from './server';
import {logInfo} from './utils/logger';
import config from 'config';

const PORT = config.get<number>('PORT') || 3000;

server.listen(PORT, () => logInfo(`Server is running on port ${PORT}`));
