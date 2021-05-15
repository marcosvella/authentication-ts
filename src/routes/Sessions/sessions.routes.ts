import { Router } from 'express';

import AuthenticateUserService from './services/AuthenticateUserService';
import RenewAccessTokenSerice from './services/RenewRefreshTokenService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateUser = new AuthenticateUserService();

  const { user, accessToken, refreshToken } = await authenticateUser.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, accessToken, refreshToken });
});

sessionsRouter.get('/refresh-token', async (request, response) => {
  const oldToken = request.headers.authorization;

  const RenewAccessToken = new RenewAccessTokenSerice();
  const accessToken = await RenewAccessToken.execute({ oldToken });

  return response.json({ accessToken });
});

export default sessionsRouter;
