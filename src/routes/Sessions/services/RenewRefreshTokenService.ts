import { request } from 'express';
import { sign, verify } from 'jsonwebtoken';

import AppError from '../../../errors/AppError';
import authConfig from '../../../config/auth';

interface Request {
  oldToken: string;
}

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

class RenewAccessToken {
  public async execute({ oldToken }: Request) {
    if (!oldToken) {
      throw new AppError('JWT token is missing', 401);
    }

    const [, token] = oldToken.split(' ');

    try {
      const decoded = verify(token, authConfig.jwt.refreshToken.secret);

      const { sub } = decoded as TokenPayload;

      request.user = {
        id: sub,
      };

      const refreshToken = sign({}, authConfig.jwt.accessToken.secret, {
        subject: sub,
        expiresIn: authConfig.jwt.accessToken.expiresIn,
      });

      return refreshToken;
    } catch (err) {
      throw new AppError('Invalid JWT token', 401);
    }
  }
}

export default RenewAccessToken;
