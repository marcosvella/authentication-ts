import { Router } from 'express';

import usersRouter from './Users/users.routes';
import sessionsRouter from './Sessions/sessions.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
