import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '../errors/AppError';

import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticaded(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeaders = request.headers.authorization;

  if (!authHeaders) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeaders.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.accessToken.secret);
    console.log(decoded);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError('Invalid JWT token', 401);
  }
}
