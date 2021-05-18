import { Router } from 'express';
import { getRepository } from 'typeorm';

const usersRouter = Router();

import User from '../../models/Users';
import authentication from '../../middlewares/authentication';
import CreateUserService from './services/CreateUserService';
import RedisCache from '../../common/redis';

usersRouter.get('/', authentication, async (request, response) => {
  const usersRepository = getRepository(User);

  const users = await usersRepository.find();
  return response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.get('/redis', async (request, response) => {
  const cached = await RedisCache.get({ key: 'Token' });
  return response.json({ cachedData: cached });
});

usersRouter.post('/redis', async (request, response) => {
  const { token } = request.body;
  RedisCache.set({ key: 'Token', value: token, expirationTime: 60 });
  return response.json({ message: 'ok' });
});

export default usersRouter;
